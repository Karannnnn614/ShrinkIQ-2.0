import mongoose from "mongoose";
import Link from "../models/link.model.js";
import Click from "../models/click.model.js";
import { generateShortUrl } from "../utils/link.utils.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Create a short link
export const createShortLink = async (req, res) => {
  const { longUrl, customAlias, expiryTime, title } = req.body;

  // Make custom alias required
  if (!customAlias) {
    return res.status(400).json({
      error: "Custom alias is required."
    });
  }

  const userId = req.user?.id || new mongoose.Types.ObjectId(); // fallback for testing

  try {
    const existing = await Link.findOne({ shortUrl: customAlias });
    if (existing) {
      return res.status(400).json({
        error: "Custom alias is already in use. Try a different one.",
      });
    }

    const newLink = new Link({
      originalUrl: longUrl,
      shortUrl: customAlias,
      userId,
      expirationDate: expiryTime || null,
      title: title || longUrl.substring(0, 30) // Use title or truncated URL
    });

    await newLink.save();

    return res.status(201).json({
      id: newLink._id,
      original_url: newLink.originalUrl,
      short_code: newLink.shortUrl,
      short_url: `${BASE_URL}/${customAlias}`,
      created_at: newLink.createdAt,
      expires_at: newLink.expirationDate,
      title: newLink.title,
      clicks: 0,
      message: "Short link created successfully."
    });
  } catch (error) {
    console.error("Error in createShortLink:", error.message);
    return res.status(500).json({ error: "Failed to create short link." });
  }
};

// Get all links for the current user
export const getUserLinks = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch links with aggregated click counts
    const userLinks = await Link.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $lookup: { 
          from: "clicks", 
          localField: "shortUrl", 
          foreignField: "shortUrl", 
          as: "clickData" 
        } 
      },
      { 
        $project: { 
          id: "$_id",
          original_url: "$originalUrl", 
          short_code: "$shortUrl", 
          title: "$title",
          created_at: "$createdAt",
          expires_at: "$expirationDate", 
          clicks: { $size: "$clickData" } 
        } 
      },
      { $sort: { created_at: -1 } }
    ]);

    return res.status(200).json(userLinks);
  } catch (error) {
    console.error("Error fetching user links:", error);
    return res.status(500).json({ error: "Failed to fetch your links." });
  }
};

// Get statistics for a specific link
export const getLinkStats = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // First verify the link belongs to the user
    const link = await Link.findOne({ 
      _id: id, 
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found or not authorized." });
    }

    // Get clicks with additional analytics
    const clicks = await Click.aggregate([
      { $match: { shortUrl: link.shortUrl } },
      { 
        $group: { 
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            device: "$device"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.day",
          devices: {
            $push: {
              device: "$_id.device",
              count: "$count"
            }
          },
          totalCount: { $sum: "$count" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      link: {
        id: link._id,
        original_url: link.originalUrl,
        short_code: link.shortUrl,
        title: link.title,
        created_at: link.createdAt
      },
      clicks: clicks.map(day => ({
        date: day._id,
        devices: day.devices,
        total: day.totalCount
      })),
      total_clicks: clicks.reduce((acc, day) => acc + day.totalCount, 0)
    });
  } catch (error) {
    console.error("Error fetching link stats:", error);
    return res.status(500).json({ error: "Failed to fetch link statistics." });
  }
};

// Update a link
export const updateLink = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, customAlias, expiryTime } = req.body;

  try {
    // Find the link first
    const link = await Link.findOne({ 
      _id: id, 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found or not authorized." });
    }

    // If customAlias is provided and different, validate it
    if (customAlias && customAlias !== link.shortUrl) {
      // Custom alias is required
      if (!customAlias.trim()) {
        return res.status(400).json({ error: "Custom alias cannot be empty." });
      }
      
      const aliasExists = await Link.findOne({ shortUrl: customAlias });
      if (aliasExists) {
        return res.status(400).json({ error: "Custom alias is already in use." });
      }
    }

    // Update fields if provided
    if (title) link.title = title;
    if (customAlias) link.shortUrl = customAlias;
    if (expiryTime !== undefined) link.expirationDate = expiryTime || null;

    await link.save();

    return res.status(200).json({
      id: link._id,
      original_url: link.originalUrl,
      short_code: link.shortUrl,
      short_url: `${BASE_URL}/${link.shortUrl}`,
      title: link.title,
      created_at: link.createdAt,
      expires_at: link.expirationDate,
      message: "Link updated successfully."
    });
  } catch (error) {
    console.error("Error updating link:", error);
    return res.status(500).json({ error: "Failed to update link." });
  }
};

// Delete a link
export const deleteLink = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await Link.deleteOne({ 
      _id: id, 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Link not found or not authorized." });
    }

    // Optionally, also delete associated clicks
    await Click.deleteMany({ shortUrl: id });

    return res.status(200).json({ message: "Link deleted successfully." });
  } catch (error) {
    console.error("Error deleting link:", error);
    return res.status(500).json({ error: "Failed to delete link." });
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

    // Check if link has expired
    if (link.expirationDate && new Date() > new Date(link.expirationDate)) {
      return res.status(410).json({ error: "This link has expired." });
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
