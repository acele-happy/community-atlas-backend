const Service = require("../models/Service");
const User = require("../models/User");

// ── GET ALL SERVICES (any status) ────────────────────────────────────────
// GET /api/admin/services
// Query params: status=pending|approved|rejected, category
const getAllServices = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category && category !== "All") filter.category = category;

    const services = await Service.find(filter)
      .populate("submittedBy", "name email phone")
      .populate("moderatedBy", "name email")
      .sort({ createdAt: -1 });

    // Summary counts
    const counts = {
      total: await Service.countDocuments(),
      pending: await Service.countDocuments({ status: "pending" }),
      approved: await Service.countDocuments({ status: "approved" }),
      rejected: await Service.countDocuments({ status: "rejected" }),
    };

    res.status(200).json({ success: true, counts, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── APPROVE A SERVICE ─────────────────────────────────────────────────────
// PUT /api/admin/services/:id/approve
const approveService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        moderatedBy: req.user._id,
        moderationNote: req.body.note || "",
        moderatedAt: new Date(),
      },
      { new: true }
    ).populate("submittedBy", "name email");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({
      success: true,
      message: `"${service.name}" has been approved.`,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── REJECT A SERVICE ──────────────────────────────────────────────────────
// PUT /api/admin/services/:id/reject
const rejectService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        moderatedBy: req.user._id,
        moderationNote: req.body.note || "Does not meet community guidelines.",
        moderatedAt: new Date(),
      },
      { new: true }
    ).populate("submittedBy", "name email");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({
      success: true,
      message: `"${service.name}" has been rejected.`,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE A SERVICE ──────────────────────────────────────────────────────
// DELETE /api/admin/services/:id
const adminDeleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({ success: true, message: "Service permanently deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL USERS ─────────────────────────────────────────────────────────
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PROMOTE USER TO ADMIN ─────────────────────────────────────────────────
// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ["community_member", "service_provider", "admin"];

    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: `${user.name}'s role updated to ${role}.`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DEACTIVATE A USER ─────────────────────────────────────────────────────
// PUT /api/admin/users/:id/deactivate
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: `${user.name}'s account has been deactivated.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllServices,
  approveService,
  rejectService,
  adminDeleteService,
  getAllUsers,
  updateUserRole,
  deactivateUser,
};
