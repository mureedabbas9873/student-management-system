const mysql = require("mysql2/promise");
require("dotenv").config();

// Connection pool: reuses connections, faster than opening a new one per request
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "student_management",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
