// ...imports and helpers unchanged
import Link from "../models/link.model.js";
import Click from "../models/click.model.js";

const handleServerError = (res, error) => {
  console.error("Analytics Error:", error);
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message,
  });
};
// ✅ Put this near the top of analytics.controller.js
const formatExpirationStatus = (expirationDate) => {
  if (!expirationDate) return "N/A";
  return expirationDate > new Date() ? "Active" : "Expired"
};

export const getUserAnalytics = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const links = await Link.find({ userId });

    const analyticsData = await Promise.all(
      links.map(
        async ({ originalUrl, shortUrl, createdAt, expirationDate }) => {
          const clicks = await Click.find({ shortUrl });
          return {
            originalUrl,
            shortUrl,
            clickCount: clicks.length,
            createdDate: createdAt,
            expirationStatus: formatExpirationStatus(expirationDate),
          };
        }
      )
    );

    res.status(200).json({ success: true, data: analyticsData });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getClicksOverTime = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const links = await Link.find({ userId });

    const chartData = await Promise.all(
      links.map(async ({ shortUrl }) => {
        const clicks = await Click.find({ shortUrl });
        const clickCounts = clicks.reduce((acc, { timestamp }) => {
          const date = timestamp.toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        return { shortUrl, clickCounts };
      })
    );

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getDeviceBrowserBreakdown = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const links = await Link.find({ userId });

    const breakdown = await links.reduce(async (accPromise, { shortUrl }) => {
      const acc = await accPromise;
      const clicks = await Click.find({ shortUrl });

      clicks.forEach(({ device }) => {
        acc[device] = (acc[device] || 0) + 1;
      });

      return acc;
    }, Promise.resolve({}));

    res.status(200).json({ success: true, data: breakdown });
  } catch (error) {
    handleServerError(res, error);
  }
};
