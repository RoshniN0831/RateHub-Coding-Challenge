const express = require("express");

const {
  addStore,
  getStores,
  getStoreById,
  getOwnerStore,
} = require("../controllers/storeController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all stores
router.get(
  "/",
  authenticateToken,
  getStores
);

// Get store belonging to logged-in owner
router.get(
  "/owner",
  authenticateToken,
  getOwnerStore
);

// Get one store by ID
router.get(
  "/:id",
  authenticateToken,
  getStoreById
);

// Add a new store
router.post(
  "/",
  authenticateToken,
  addStore
);

module.exports = router;