const express = require("express");

const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");


const router = express.Router();


// Signup
router.post(
  "/signup",
  signup
);


// Login
router.post(
  "/login",
  login
);


// Change password
router.put(
  "/change-password",
  authenticateToken,
  changePassword
);


module.exports = router;