const path = require("path");
// Ensure environment variables are loaded for test env
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const { initializeDatabase } = require("../src/config/database");

module.exports = async () => {
  // Initialize DB schema before tests run
  try {
    await initializeDatabase();
    console.log("Jest global setup: database initialized");
  } catch (err) {
    console.error("Jest global setup error:", err);
    throw err;
  }
};
