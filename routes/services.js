const express = require("express");
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getMyListings,
} = require("../controllers/serviceController");
const { protect, restrict } = require("../middleware/auth");

// ── Public routes ─────────────────────────────────────────────────────────
router.get("/", getServices);          // GET /api/services
router.get("/:id", getService);        // GET /api/services/:id

// ── Protected routes ──────────────────────────────────────────────────────

// Service providers and admins can submit services
router.post(
  "/", 
  protect,
  restrict("service_provider", "admin"),
  createService
);

// Get own listings (service providers)
router.get(
  "/my/listings",
  protect,
  restrict("service_provider", "admin"),
  getMyListings
);

// Update and delete own service
router.put("/:id", protect, restrict("service_provider", "admin"), updateService);
router.delete("/:id", protect, restrict("service_provider", "admin"), deleteService);

module.exports = router;
