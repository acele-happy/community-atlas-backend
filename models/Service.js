const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Health", "Education", "Business", "Organization"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      // Human-readable address
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      sector: {
        type: String,
        trim: true,
        default: "Gasabo",
      },
      district: {
        type: String,
        trim: true,
        default: "Kigali",
      },
      // GeoJSON coordinates for map display
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [30.0588, -1.9517],
        },
      },
    },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      website: { type: String, trim: true },
    },
    // Who submitted this service
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Moderation status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderationNote: {
      type: String,
      maxlength: 300,
    },
    moderatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for geospatial queries (map search)
serviceSchema.index({ "location.coordinates": "2dsphere" });

// Index for text search
serviceSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Service", serviceSchema);
