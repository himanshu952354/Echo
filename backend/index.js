import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "fs";
import { createClient } from "@deepgram/sdk";
import Sentiment from "sentiment";
import nodemailer from "nodemailer";

import connectDB from "./db.js";
import User from "./User.js";
import Analysis from "./Analysis.js";

dotenv.config();
connectDB();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT"],
}));
app.use(express.json());

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.send("Echo backend is running 🚀");
});

/* -------------------- MULTER SETUP -------------------- */
// Ensure uploads directory exists (IMPORTANT for Render)
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });
const sentiment = new Sentiment();

/* -------------------- SIGNUP -------------------- */
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
});

/* -------------------- LOGIN -------------------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

/* -------------------- PROCESS CALL -------------------- */
app.post("/process-call", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No audio uploaded" });
    }

    const { callerName, userId } = req.body;
    if (!userId) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ msg: "User ID is required" });
    }

    const deepgram = createClient(process.env.DEEPGRAM_KEY);
    const audioBuffer = fs.readFileSync(req.file.path);

    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        mimetype: req.file.mimetype,
        model: "nova-2-general",
        smart_format: true,
      }
    );

    const transcript =
      response?.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    const sentimentResult = sentiment.analyze(transcript);

    const newAnalysis = await Analysis.create({
      callerName: callerName || "Unknown",
      transcript,
      sentimentScore: sentimentResult.score,
      positiveKeywords: sentimentResult.positive.slice(0, 5),
      negativeKeywords: sentimentResult.negative.slice(0, 5),
      date: new Date(),
      user: userId,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: newAnalysis,
    });
  } catch (error) {
    console.error("Process call error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ msg: "Error processing call" });
  }
});

/* -------------------- FETCH HISTORY -------------------- */
app.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const history = await Analysis.find({ user: userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch history" });
  }
});

/* -------------------- STATS -------------------- */
app.get("/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const answeredCalls = await Analysis.countDocuments({ user: userId });
    res.json({ answeredCalls });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch stats" });
  }
});

/* -------------------- UPDATE USER -------------------- */
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update user" });
  }
});

/* -------------------- SUPPORT EMAIL -------------------- */
app.post("/support", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Support Query from ${name}`,
      text: message,
    });

    res.json({ success: true, msg: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Echo backend running on port ${PORT}`);
});
