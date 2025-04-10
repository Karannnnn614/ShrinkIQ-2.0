import mongoose from "mongoose";
import Link from "../models/link.model.js";
import Click from "../models/click.model.js";
import { generateShortUrl } from "../utils/link.utils.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Create a short link
export const createShortLink = async (req, res) => {
  const { longUrl, customAlias, expirationDate } = req.body;

  const userId = req.user?.id || new mongoose.Types.ObjectId(); // fallback for testing

  try {
    const shortCode = customAlias || generateShortUrl();

    const existing = await Link.findOne({ shortUrl: shortCode });
    if (existing) {
      return res.status(400).json({
        error: "Custom alias is already in use. Try a different one.",
      });
    }

    const newLink = new Link({
      originalUrl: longUrl,
      shortUrl: shortCode,
      userId,
      expirationDate,
    });

    await newLink.save();

    return res.status(201).json({
      shortUrl: `${BASE_URL}/${shortCode}`,
      message: "Short link created successfully.",
    });
  } catch (error) {
    console.error("Error in createShortLink:", error.message);
    return res.status(500).json({ error: "Failed to create short link." });
  }
};

// Redirect and async log click
export const redirectToOriginalUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ error: "Short link not found." });
    }

    // Send redirect response immediately
    res.redirect(link.originalUrl);

    // Async click log (fire and forget)
    Click.create({
      shortUrl,
      timestamp: new Date(),
      ipAddress: req.ip,
      device: getDeviceType(req.headers["user-agent"]),
    }).catch((err) => {
      console.error("Failed to log click:", err);
    });
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Failed to redirect." });
  }
};

// Simple user-agent parser (can use external libs if needed)
const getDeviceType = (ua = "") => {
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  return "Desktop";
};
