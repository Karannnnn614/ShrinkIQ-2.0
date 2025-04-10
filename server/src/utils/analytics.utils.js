// filepath: /url-shortener-api/url-shortener-api/src/utils/analytics.utils.js

const formatAnalyticsData = (data) => {
    return data.map(item => ({
        originalUrl: item.originalUrl,
        shortUrl: item.shortUrl,
        clickCount: item.clickCount,
        createdDate: item.createdDate,
        isExpired: item.expirationDate ? new Date(item.expirationDate) < new Date() : false,
    }));
};

const getClicksOverTime = (clicks) => {
    const clicksOverTime = {};
    clicks.forEach(click => {
        const date = new Date(click.timestamp).toDateString();
        clicksOverTime[date] = (clicksOverTime[date] || 0) + 1;
    });
    return clicksOverTime;
};

const getDeviceBreakdown = (clicks) => {
    const deviceBreakdown = {};
    clicks.forEach(click => {
        const device = click.device || 'Unknown';
        deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
    });
    return deviceBreakdown;
};

export { formatAnalyticsData, getClicksOverTime, getDeviceBreakdown };