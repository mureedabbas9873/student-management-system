// 404 handler for unknown routes
exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Central error handler: any error passed with next(err) lands here
exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Roll number or email already exists" });
  }
  if (err.code === "ECONNREFUSED" || err.code === "ER_ACCESS_DENIED_ERROR" || err.code === "ER_BAD_DB_ERROR") {
    return res.status(500).json({ message: "Database connection problem. Check your .env settings." });
  }
  res.status(500).json({ message: "Something went wrong on the server" });
};
