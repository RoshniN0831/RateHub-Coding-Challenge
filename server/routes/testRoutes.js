const express = require("express");
const pool = require("../config/db");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT 1 AS database_connection"
    );

    res.json({
      success: true,
      message: "RateHub API and database are working",
      database: result[0].database_connection === 1,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticateToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access confirmed",
      user: req.user,
    });
  }
);
module.exports = router;