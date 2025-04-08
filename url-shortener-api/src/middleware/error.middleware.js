export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
};
