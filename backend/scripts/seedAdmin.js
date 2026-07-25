/**
 * Creates a default admin user for first-time setup.
 * Run: node scripts/seedAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/parkingDB";

const seedAdmin = async () => {
  await mongoose.connect(MONGO_URI);

  const email = process.env.ADMIN_EMAIL || "admin@parksmart.com";
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Updated existing user "${email}" to admin role.`);
    } else {
      console.log(`Admin user already exists: ${email}`);
    }
  } else {
    await User.create({
      username: "Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "admin123",
      phoneNumber: "9999999999",
      role: "admin",
    });
    console.log(`Admin user created: ${email} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
