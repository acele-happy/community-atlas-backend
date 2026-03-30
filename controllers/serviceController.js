const Service = require("../models/Service");

// ── GET ALL APPROVED SERVICES (public) ───────────────────────────────────
// GET /api/services
// Query params: category, search, sector
const getServices = async (req, res) => {
  try {
    const { category, search, sector } = req.query;

    // Always only return approved services to the public
    const filter = { status: "approved" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (sector) {
      filter["location.sector"] = { $regex: sector, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const services = await Service.find(filter)
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET SINGLE SERVICE (public) ───────────────────────────────────────────
// GET /api/services/:id
const getService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate("submittedBy", "name email");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── SUBMIT A SERVICE (service providers only) ─────────────────────────────
// POST /api/services
const createService = async (req, res) => {
  try {
    const {
      name, category, description,
      address, sector, district,
      longitude, latitude,
      phone, email, website,
    } = req.body;

    const service = await Service.create({
      name,
      category,
      description,
      location: {
        address,
        sector: sector || "Gasabo",
        district: district || "Kigali",
        coordinates: {
          type: "Point",
          coordinates: [
            parseFloat(longitude) || 30.0588,
            parseFloat(latitude) || -1.9517,
          ],
        },
      },
      contact: { phone, email, website },
      submittedBy: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Service submitted successfully! It will be reviewed by a moderator.",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE OWN SERVICE (service provider — only their own listings) ───────
// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    // Only the owner OR an admin can update
    if (
      service.submittedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own service listings.",
      });
    }

    const {
      name, category, description,
      address, sector, district,
      longitude, latitude,
      phone, email, website,
    } = req.body;

    // If provider edits their listing, reset to pending for re-review
    const newStatus =
      req.user.role === "admin" ? service.status : "pending";

    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name, category, description,
        "location.address": address,
        "location.sector": sector,
        "location.district": district,
        "location.coordinates.coordinates": [
          parseFloat(longitude) || service.location.coordinates.coordinates[0],
          parseFloat(latitude) || service.location.coordinates.coordinates[1],
        ],
        "contact.phone": phone,
        "contact.email": email,
        "contact.website": website,
        status: newStatus,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE OWN SERVICE (owner or admin) ──────────────────────────────────
// DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    if (
      service.submittedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own service listings.",
      });
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: "Service listing deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET MY OWN SUBMISSIONS (service provider) ────────────────────────────
// GET /api/services/my-listings
const getMyListings = async (req, res) => {
  try {
    const services = await Service.find({ submittedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getMyListings,
};
