// filepath: /url-shortener-api/url-shortener-api/src/controllers/link.controller.js
import mongoose from "mongoose";
import Link from "../models/link.model.js";
import Click from "../models/click.model.js";
import { generateShortUrl } from "../utils/link.utils.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // Adjust this to match your frontend/domain

// Create a short link
export const createShortLink = async (req, res) => {
  const { longUrl, customAlias, expirationDate } = req.body;

  // Use authenticated user ID or mock one for dev/testing
  const userId = req.user?.id || new mongoose.Types.ObjectId();

  try {
    const shortCode = customAlias || generateShortUrl();

    // Check if custom alias already exists
    const existing = await Link.findOne({ shortUrl: shortCode });
    if (existing) {
      return res
        .status(400)
        .json({
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
    return res.status(500).json({
      error: "Failed to create short link.",
    });
  }
};
// Redirect to original URL
export const redirectToOriginalUrl = async (req, res) => {
  const { shortUrl } = req.params;
  console.log("Short URL:", shortUrl);
  const existing = await Link.findOne({ shortUrl });
  if (!existing) {
    return res
      .status(400)
      .json({ error: "Custom alias is already in use. Try a different one." });
  }

  try {
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ error: "Short link not found." });
    }

    // Log click event
    const clickData = new Click({
      shortUrl,
      timestamp: new Date(),
      ipAddress: req.ip, // ✅ Corrected
      deviceInfo: req.headers["user-agent"], // ✅ Corrected
    });


    await clickData.save();
    res.redirect(link.originalUrl);
  }  catch (error) {
  console.error("Redirect error:", error);
  res.status(500).json({ error: "Failed to redirect." });
}

};
