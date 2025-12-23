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
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const sentiment = new Sentiment();


/* ---------- SIGNUP ---------- */
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
    });

    res.json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    res.json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
});

/* ---------- PROCESS CALL ---------- */
app.post("/process-call", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No audio uploaded" });
    }
    const { callerName, userId } = req.body;

    if (!userId) {
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

    // Perform sentiment analysis
    const sentimentResult = sentiment.analyze(transcript);

    // Extract positive and negative keywords
    const positiveKeywords = sentimentResult.positive.slice(0, 5);
    const negativeKeywords = sentimentResult.negative.slice(0, 5);

    // Save the analysis to the database
    const newAnalysis = new Analysis({
      callerName: callerName || "Unknown",
      transcript: transcript,
      sentimentScore: sentimentResult.score,
      positiveKeywords: positiveKeywords,
      negativeKeywords: negativeKeywords,
      date: new Date(),
      user: userId,
    });
    await newAnalysis.save();

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: newAnalysis,
    });
  } catch (error) {
    console.error("Error processing call:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ msg: "Error processing call" });
  }
});

/* ---------- FETCH HISTORY ---------- */
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

/* ---------- GET STATS ---------- */
app.get("/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
    const answeredCalls = await Analysis.countDocuments({ user: userId });
    const user = await User.findById(userId);
    const abandonedCalls = user ? (user.abandonedCalls || 0) : 0;
    res.json({ answeredCalls, abandonedCalls });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch stats" });
  }
});

/* ---------- LOG ABANDONED CALL ---------- */
app.post("/log-abandoned", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ msg: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.abandonedCalls = (user.abandonedCalls || 0) + 1;
    await user.save();

    res.json({ success: true, abandonedCalls: user.abandonedCalls });
  } catch (error) {
    res.status(500).json({ msg: "Failed to log abandoned call" });
  }
});

/* ---------- UPDATE USER ---------- */
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    await user.save();

    res.json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update user" });
  }
});

/* ---------- SUPPORT EMAIL ---------- */
app.post("/support", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Support Query from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, msg: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    // Detailed error for debugging
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    res.status(500).json({ msg: "Failed to send your message. Check server logs." });
  }
});

app.listen(5000, () => {
  console.log("Backend running on 5000");
});