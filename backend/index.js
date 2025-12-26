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
import AbandonedCall from "./AbandonedCall.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://echo-gold.vercel.app", process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });
const sentiment = new Sentiment();

// Health Check
app.get("/", (req, res) => {
  res.send("Echo API is running");
});

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

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: "",
        city: "",
        timezone: "UTC/GMT -4 hours",
        dailyUtilization: 7,
        coreWorkRangeStart: 3,
        coreWorkRangeEnd: 6
      }
    });
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

    // Return full user object (excluding sensitive data if needed, but here we send what's safe)
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        city: user.city,
        timezone: user.timezone,
        dailyUtilization: user.dailyUtilization,
        coreWorkRangeStart: user.coreWorkRangeStart,
        coreWorkRangeEnd: user.coreWorkRangeEnd,
        abandonedCalls: user.abandonedCalls
      }
    });
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

/* ---------- LEADERBOARD ---------- */
app.get("/leaderboard", async (req, res) => {
  try {
    // 1. Aggregate answered calls (Analysis)
    const answeredAgg = await Analysis.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 }, avgSentiment: { $avg: "$sentimentScore" } } }
    ]);

    // 2. Aggregate abandoned calls (AbandonedCall)
    const abandonedAgg = await AbandonedCall.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    // 3. Create a map to merge data
    const userStats = {};

    answeredAgg.forEach(item => {
      const userId = item._id.toString();
      if (!userStats[userId]) userStats[userId] = { answered: 0, abandoned: 0, avgSentiment: 0 };
      userStats[userId].answered = item.count;
      userStats[userId].avgSentiment = item.avgSentiment;
    });

    abandonedAgg.forEach(item => {
      const userId = item._id.toString();
      if (!userStats[userId]) userStats[userId] = { answered: 0, abandoned: 0, avgSentiment: 0 };
      userStats[userId].abandoned = item.count;
    });

    // 4. Calculate Service Level and Sort
    const sortedStats = Object.keys(userStats).map(userId => {
      const stats = userStats[userId];
      const totalCalls = stats.answered + stats.abandoned;
      // Service Level = (Answered / Total) * 100
      const serviceLevelVal = totalCalls > 0 ? (stats.answered / totalCalls) * 100 : 0;

      return {
        userId,
        ...stats,
        totalCalls,
        serviceLevelVal
      };
    }).sort((a, b) => b.serviceLevelVal - a.serviceLevelVal) // Sort descending by Service Level
      .slice(0, 5); // Top 5

    // 5. Populate user details
    const populated = await Promise.all(sortedStats.map(async (entry) => {
      const user = await User.findById(entry.userId);
      return {
        name: user ? user.username : "Unknown",
        profilePicture: user ? user.profilePicture : "",
        calls: entry.answered,
        satisfaction: entry.avgSentiment ? (entry.avgSentiment > 0 ? (3 + Math.min(2, entry.avgSentiment / 5)).toFixed(1) : "3.5") : "0.0",
        serviceLevel: entry.serviceLevelVal.toFixed(1) + "%"
      };
    }));

    res.json(populated);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ msg: "Failed to fetch leaderboard" });
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
    // Use AbandonedCall collection for consistency with leaderboard
    const abandonedCalls = await AbandonedCall.countDocuments({ user: userId });
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

    // Update legacy counter
    user.abandonedCalls = (user.abandonedCalls || 0) + 1;
    await user.save();

    // Create new timestamped record
    await AbandonedCall.create({
      user: userId,
      date: new Date()
    });

    res.json({ success: true, abandonedCalls: user.abandonedCalls });
  } catch (error) {
    console.error("Error logging abandoned call:", error);
    res.status(500).json({ msg: "Failed to log abandoned call" });
  }
});

/* ---------- ABANDONED HISTORY ---------- */
app.get("/abandoned-history", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
    const history = await AbandonedCall.find({ user: userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching abandoned history:", error);
    res.status(500).json({ msg: "Failed to fetch abandoned history" });
  }
});

/* ---------- UPDATE USER ---------- */
/* ---------- UPDATE USER ---------- */
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // findByIdAndUpdate with { new: true } returns the updated document
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: "Failed to update user" });
  }
});

/* ---------- UPLOAD PROFILE PICTURE ---------- */
app.post("/user/:id/profile-pic", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Add /uploads/ prefix for referencing
    const profilePictureUrl = `/uploads/${req.file.filename}`;

    // Delete old picture if it exists and isn't a default/external URL
    if (user.profilePicture && user.profilePicture.startsWith("/uploads/")) {
      const oldPath = user.profilePicture.substring(1); // remove leading slash
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Failed to delete old profile pic:", e);
        }
      }
    }

    user.profilePicture = profilePictureUrl;
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({ msg: "Failed to upload profile picture" });
  }
});

/* ---------- SUPPORT EMAIL ---------- */
app.post("/support", async (req, res) => {
  try {
    const { name, email, message } = req.body;


    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
      return res.status(500).json({ msg: "Server configuration error (Missing Email Credentials)" });
    }

    console.log(`Attempting to send email from: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      // Force IPv4 and set timeout to avoid hang-ups
      family: 4,
      connectionTimeout: 10000
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});