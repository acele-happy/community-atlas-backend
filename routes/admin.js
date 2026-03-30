const express = require("express");
const router = express.Router();
const {
  getAllServices,
  approveService,
  rejectService,
  adminDeleteService,
  getAllUsers,
  updateUserRole,
  deactivateUser,
} = require("../controllers/adminController");
const { protect, restrict } = require("../middleware/auth");

// ALL admin routes require authentication + admin role
router.use(protect, restrict("admin"));

// ── Service moderation ────────────────────────────────────────────────────
router.get("/services", getAllServices);                      // GET  /api/admin/services
router.put("/services/:id/approve", approveService);         // PUT  /api/admin/services/:id/approve
router.put("/services/:id/reject", rejectService);           // PUT  /api/admin/services/:id/reject
router.delete("/services/:id", adminDeleteService);          // DELETE /api/admin/services/:id

// ── User management ───────────────────────────────────────────────────────
router.get("/users", getAllUsers);                            // GET  /api/admin/users
router.put("/users/:id/role", updateUserRole);               // PUT  /api/admin/users/:id/role
router.put("/users/:id/deactivate", deactivateUser);         // PUT  /api/admin/users/:id/deactivate

module.exports = router;
