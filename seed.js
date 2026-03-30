/**
 * Seed script — populates the database with sample data
 * Run once with: node seed.js
 * To clear and re-seed: node seed.js --fresh
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Service = require("./models/Service");

dotenv.config();

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@communityatlas.rw",
    password: "admin123",
    role: "admin",
    phone: "+250 788 000 001",
  },
  {
    name: "Grace Uwimana",
    email: "grace@example.com",
    password: "provider123",
    role: "service_provider",
    phone: "+250 788 000 002",
  },
  {
    name: "Jean Pierre Habimana",
    email: "jean@example.com",
    password: "provider123",
    role: "service_provider",
    phone: "+250 788 000 003",
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  if (process.argv.includes("--fresh")) {
    await User.deleteMany();
    await Service.deleteMany();
    console.log("🗑️  Cleared existing data");
  }

  // Create users
  const createdUsers = await User.create(sampleUsers);
  const admin = createdUsers[0];
  const provider1 = createdUsers[1];
  const provider2 = createdUsers[2];
  console.log(`👤 Created ${createdUsers.length} users`);

  const sampleServices = [
    {
      name: "Kimisagara Health Centre",
      category: "Health",
      description: "Public health facility offering general outpatient, maternal, and child health services to the Kimisagara community.",
      location: {
        address: "Kimisagara, Nyarugenge",
        sector: "Kimisagara",
        district: "Kigali",
        coordinates: { type: "Point", coordinates: [30.0588, -1.9517] },
      },
      contact: { phone: "+250 788 100 001" },
      submittedBy: provider1._id,
      status: "approved",
      moderatedBy: admin._id,
      moderatedAt: new Date(),
    },
    {
      name: "Gasabo Youth Learning Hub",
      category: "Education",
      description: "Free tutoring, computer literacy classes, and career mentorship for youth aged 14–25. Open Monday to Saturday.",
      location: {
        address: "Remera, Gasabo",
        sector: "Remera",
        district: "Kigali",
        coordinates: { type: "Point", coordinates: [30.1018, -1.9355] },
      },
      contact: { phone: "+250 788 100 002", email: "hub@gasabo.rw" },
      submittedBy: provider1._id,
      status: "approved",
      moderatedBy: admin._id,
      moderatedAt: new Date(),
    },
    {
      name: "Inzira Fresh Market",
      category: "Business",
      description: "Local fresh produce market open every day from 6am–7pm. Fresh vegetables, fruits, and dairy products at fair prices.",
      location: {
        address: "Gikondo, Kicukiro",
        sector: "Gikondo",
        district: "Kigali",
        coordinates: { type: "Point", coordinates: [30.0624, -1.9731] },
      },
      contact: { phone: "+250 788 100 003" },
      submittedBy: provider2._id,
      status: "approved",
      moderatedBy: admin._id,
      moderatedAt: new Date(),
    },
    {
      name: "Ubumuntu Women's Cooperative",
      category: "Organization",
      description: "Women-led cooperative offering tailoring, baking training, and micro-finance support for low-income women.",
      location: {
        address: "Kacyiru, Gasabo",
        sector: "Kacyiru",
        district: "Kigali",
        coordinates: { type: "Point", coordinates: [30.0883, -1.9349] },
      },
      contact: { phone: "+250 788 100 004", email: "ubumuntu@coop.rw" },
      submittedBy: provider2._id,
      status: "pending",
    },
  ];

  const createdServices = await Service.create(sampleServices);
  console.log(`📋 Created ${createdServices.length} services`);

  console.log("\n─────────────────────────────────────────");
  console.log("✅ Database seeded successfully!");
  console.log("\n🔑 Test Accounts:");
  console.log("  Admin:    admin@communityatlas.rw  / admin123");
  console.log("  Provider: grace@example.com        / provider123");
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
