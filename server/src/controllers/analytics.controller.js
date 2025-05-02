import Link from "../models/link.model.js";
import Click from "../models/click.model.js";
import mongoose from "mongoose";

const handleServerError = (res, error) => {
  console.error("Analytics Error:", error);
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message,
  });
};

// Helper function for expiration status
const formatExpirationStatus = (expirationDate) => {
  if (!expirationDate) return "N/A";
  return expirationDate > new Date() ? "Active" : "Expired";
};

export const getUserAnalytics = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Use aggregation for more efficient querying
    const userStats = await Link.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "clicks",
          localField: "shortUrl",
          foreignField: "shortUrl",
          as: "clicksData"
        }
      },
      {
        $project: {
          originalUrl: 1,
          shortUrl: 1,
          title: 1,
          createdAt: 1,
          expirationDate: 1,
          clickCount: { $size: "$clicksData" },
          expirationStatus: {
            $cond: {
              if: { $eq: ["$expirationDate", null] },
              then: "N/A",
              else: {
                $cond: {
                  if: { $gt: ["$expirationDate", new Date()] },
                  then: "Active",
                  else: "Expired"
                }
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    // Calculate summary statistics
    const totalLinks = userStats.length;
    const totalClicks = userStats.reduce((sum, link) => sum + link.clickCount, 0);
    const topPerformingLink = userStats.reduce((max, link) => 
      link.clickCount > (max.clickCount || 0) ? link : max, {});

    res.status(200).json({ 
      success: true, 
      data: {
        links: userStats,
        summary: {
          totalLinks,
          totalClicks,
          avgClicksPerLink: totalLinks ? (totalClicks / totalLinks).toFixed(2) : 0,
          topPerformingLink: topPerformingLink.shortUrl || 'None'
        }
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getClicksOverTime = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get links belonging to the user
    const userLinks = await Link.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    
    const shortUrls = userLinks.map(link => link.shortUrl);
    
    // Get aggregated clicks by date
    const clicksOverTime = await Click.aggregate([
      { 
        $match: { 
          shortUrl: { $in: shortUrls },
          timestamp: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } },
      {
        $project: {
          date: "$_id.date",
          clicks: 1,
          _id: 0
        }
      }
    ]);
    
    // Fill in missing dates with zero clicks
    const dateMap = clicksOverTime.reduce((acc, { date, clicks }) => {
      acc[date] = clicks;
      return acc;
    }, {});
    
    const allDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      allDates.push({
        date: dateStr,
        clicks: dateMap[dateStr] || 0
      });
    }
    
    res.status(200).json({ success: true, data: allDates });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getDailyStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Get links for this user
    const userLinks = await Link.find({ userId: new mongoose.Types.ObjectId(userId) });
    const shortUrls = userLinks.map(link => link.shortUrl);
    
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get stats for today and yesterday
    const todayStats = await Click.countDocuments({
      shortUrl: { $in: shortUrls },
      timestamp: { $gte: today }
    });
    
    const yesterdayStats = await Click.countDocuments({
      shortUrl: { $in: shortUrls },
      timestamp: { $gte: yesterday, $lt: today }
    });
    
    // Calculate 7-day stats
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyStats = await Click.countDocuments({
      shortUrl: { $in: shortUrls },
      timestamp: { $gte: oneWeekAgo }
    });
    
    // Calculate growth percentages
    const dailyGrowth = yesterdayStats === 0 
      ? 100 
      : (((todayStats - yesterdayStats) / yesterdayStats) * 100).toFixed(2);
    
    res.status(200).json({
      success: true,
      data: {
        today: todayStats,
        yesterday: yesterdayStats,
        weekly: weeklyStats,
        dailyGrowth,
        weeklyAverage: (weeklyStats / 7).toFixed(2)
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getDeviceBreakdown = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Get links for this user
    const userLinks = await Link.find({ userId: new mongoose.Types.ObjectId(userId) });
    const shortUrls = userLinks.map(link => link.shortUrl);
    
    // Get device breakdown using aggregation
const deviceStats = await Click.aggregate([
  { $match: { shortUrl: { $in: shortUrls } } },
  {
    $group: {
      _id: "$deviceInfo",  // Using deviceInfo as it appears to be the updated field name
      count: { $sum: 1 }
    }
  },
      {
        $project: {
          device: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Calculate percentages
    const totalClicks = deviceStats.reduce((sum, stat) => sum + stat.count, 0);
    
    const deviceBreakdown = deviceStats.map(stat => ({
      device: stat.device,
      count: stat.count,
      percentage: totalClicks ? ((stat.count / totalClicks) * 100).toFixed(2) : 0
    }));
    
    res.status(200).json({
      success: true,
      data: {
        devices: deviceBreakdown,
        total: totalClicks
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getLinkPerformance = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 7 } = req.query;
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get all user links with click statistics
    const linkPerformance = await Link.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "clicks",
          let: { short_url: "$shortUrl" },
          pipeline: [
            {
              $match: {
                $expr: { 
                  $and: [
                    { $eq: ["$shortUrl", "$$short_url"] },
                    { $gte: ["$timestamp", startDate] },
                    { $lte: ["$timestamp", endDate] }
                  ]
                }
              }
            }
          ],
          as: "recentClicks"
        }
      },
      {
        $lookup: {
          from: "clicks",
          let: { short_url: "$shortUrl" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$shortUrl", "$$short_url"] }
              }
            }
          ],
          as: "allClicks"
        }
      },
      {
        $project: {
          title: 1,
          shortUrl: 1,
          originalUrl: 1,
          createdAt: 1,
          recentClicks: { $size: "$recentClicks" },
          totalClicks: { $size: "$allClicks" }
        }
      },
      { $sort: { recentClicks: -1, totalClicks: -1 } }
    ]);
    
    // Calculate performance metrics
    const totalRecentClicks = linkPerformance.reduce((sum, link) => sum + link.recentClicks, 0);
    
    const linksWithMetrics = linkPerformance.map(link => ({
      ...link,
      percentageOfTotal: totalRecentClicks ? 
        ((link.recentClicks / totalRecentClicks) * 100).toFixed(2) : 0,
      clicksPerDay: (link.recentClicks / parseInt(days)).toFixed(2)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        links: linksWithMetrics,
        totalRecentClicks,
        period: `Last ${days} days`
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
};
