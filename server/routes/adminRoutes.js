const express = require("express");

const {
  getAdminStats,
  getAdminUsers,
  addAdminUser,
  getAdminRatings,
} = require("../controllers/adminController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADMIN STATISTICS
// =====================================================

router.get(
  "/stats",
  authenticateToken,
  getAdminStats
);


// =====================================================
// GET USERS
// =====================================================

router.get(
  "/users",
  authenticateToken,
  getAdminUsers
);


// =====================================================
// ADD USER
// =====================================================

router.post(
  "/users",
  authenticateToken,
  addAdminUser
);


// =====================================================
// GET RATINGS
// =====================================================

router.get(
  "/ratings",
  authenticateToken,
  getAdminRatings
);


module.exports = router;