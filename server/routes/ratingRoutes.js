const express = require("express");

const {
  submitRating,
  updateRating,
  getOwnerRatings,
  getMyRating,
  getMyStats,
} = require("../controllers/ratingController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// OWNER RATINGS
// =====================================================

router.get(
  "/owner",
  authenticateToken,
  getOwnerRatings
);


// =====================================================
// CURRENT USER'S DASHBOARD STATISTICS
// =====================================================

router.get(
  "/my-stats",
  authenticateToken,
  getMyStats
);


// =====================================================
// CURRENT USER'S RATING FOR ONE STORE
// =====================================================

router.get(
  "/my/:storeId",
  authenticateToken,
  getMyRating
);


// =====================================================
// SUBMIT NEW RATING
// =====================================================

router.post(
  "/",
  authenticateToken,
  submitRating
);


// =====================================================
// UPDATE EXISTING RATING
// =====================================================

router.put(
  "/",
  authenticateToken,
  updateRating
);


module.exports = router;