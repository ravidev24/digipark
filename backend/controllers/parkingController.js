const Area = require("../models/Area");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const releaseExpiredBookings = require("../utils/releaseExpiredBookings");
const { parseNominatimResponse } = require("../utils/parseNominatim");

const generateTransactionId = () =>
  `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAreaSlots = async (req, res) => {
  try {
    await releaseExpiredBookings();
    const slots = await Slot.find({ area: req.params.areaId }).populate("area");
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate("area").sort({ createdAt: -1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSlot = async (req, res) => {
  const { areaId, slotNumber, slotType, pricePerHour } = req.body;
  try {
    const area = await Area.findById(areaId);
    if (!area) return res.status(404).json({ message: "Area not found" });

    const slot = new Slot({
      area: areaId,
      slotNumber,
      slotType: slotType || "car",
      pricePerHour: parseFloat(pricePerHour) || 20,
      isBooked: false,
    });
    await slot.save();
    await slot.populate("area");

    area.totalSlots = (area.totalSlots || 0) + 1;
    await area.save();

    res.status(201).json({ message: "Slot created successfully", slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSlot = async (req, res) => {
  const { slotNumber, slotType, pricePerHour, isBooked } = req.body;
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slotNumber !== undefined) slot.slotNumber = slotNumber;
    if (slotType !== undefined) slot.slotType = slotType;
    if (pricePerHour !== undefined) slot.pricePerHour = parseFloat(pricePerHour);
    if (isBooked !== undefined) slot.isBooked = isBooked;

    await slot.save();
    await slot.populate("area");
    res.status(200).json({ message: "Slot updated successfully", slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const area = await Area.findById(slot.area);
    await Slot.findByIdAndDelete(req.params.id);

    if (area) {
      area.totalSlots = Math.max(0, (area.totalSlots || 1) - 1);
      await area.save();
    }

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateArea = async (req, res) => {
  const { name, address, lat, lng, type, totalSlots } = req.body;
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ message: "Area not found" });

    if (name !== undefined) area.name = name;
    if (address !== undefined) area.address = address;
    if (lat !== undefined) area.lat = parseFloat(lat);
    if (lng !== undefined) area.lng = parseFloat(lng);
    if (type !== undefined) area.type = type;
    if (totalSlots !== undefined) area.totalSlots = parseInt(totalSlots);

    await area.save();
    res.status(200).json({ message: "Area updated successfully", area });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ message: "Area not found" });

    const slots = await Slot.find({ area: area._id });
    const slotIds = slots.map((s) => s._id);
    await Booking.deleteMany({ slot: { $in: slotIds } });
    await Slot.deleteMany({ area: area._id });
    await Area.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Area and associated slots deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  const { slotId, startTime, endTime } = req.body;
  const userId = req.user._id;

  try {
    await releaseExpiredBookings();

    const slot = await Slot.findById(slotId).populate("area");
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const overlapping = await Booking.findOne({
      slot: slotId,
      status: "active",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (overlapping) {
      return res.status(400).json({ message: "Slot is already booked for this time period" });
    }

    const hours = Math.max(1, (end - start) / (1000 * 60 * 60));
    const totalPrice = hours * (slot.pricePerHour || 20);

    const booking = new Booking({
      user: userId,
      slot: slotId,
      startTime: start,
      endTime: end,
      totalPrice,
    });

    await booking.save();
    slot.isBooked = true;
    await slot.save();

    const transaction = new Transaction({
      user: userId,
      booking: booking._id,
      amount: totalPrice,
      paymentMethod: "upi",
      status: "completed",
      transactionId: generateTransactionId(),
    });
    await transaction.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: "slot", populate: { path: "area" } })
      .populate("user", "username email phoneNumber");

    res.status(201).json({
      message: "Booking successful",
      booking: populatedBooking,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    await releaseExpiredBookings();
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: "slot", populate: { path: "area" } })
      .populate("user", "username email phoneNumber")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: "slot", populate: { path: "area" } })
      .populate("user", "username email phoneNumber");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id).populate("slot");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    if (status === "cancelled" || status === "completed") {
      const slot = await Slot.findById(booking.slot._id || booking.slot);
      if (slot) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    await releaseExpiredBookings();
    const bookings = await Booking.find()
      .populate({ path: "slot", populate: { path: "area" } })
      .populate("user", "username email phoneNumber")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate({
        path: "booking",
        populate: { path: "slot", populate: { path: "area" } },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "username email phoneNumber")
      .populate({
        path: "booking",
        populate: { path: "slot", populate: { path: "area" } },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalAreas,
      totalSlots,
      availableSlots,
      totalBookings,
      activeBookings,
      totalTransactions,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "admin" }),
      Area.countDocuments(),
      Slot.countDocuments(),
      Slot.countDocuments({ isBooked: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "active" }),
      Transaction.countDocuments({ status: "completed" }),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const recentBookings = await Booking.find()
      .populate({ path: "slot", populate: { path: "area" } })
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalAreas,
      totalSlots,
      availableSlots,
      bookedSlots: totalSlots - availableSlots,
      totalBookings,
      activeBookings,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalBookings, activeBookings, totalTransactions, totalSpent] = await Promise.all([
      Booking.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId, status: "active" }),
      Transaction.countDocuments({ user: userId, status: "completed" }),
      Transaction.aggregate([
        { $match: { user: userId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const recentBookings = await Booking.find({ user: userId })
      .populate({ path: "slot", populate: { path: "area" } })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      totalBookings,
      activeBookings,
      totalTransactions,
      totalSpent: totalSpent[0]?.total || 0,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedData = async (req, res) => {
  try {
    await Area.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    await Transaction.deleteMany({});

    const chennaiAreas = [
      { name: "Express Avenue Mall", address: "Whites Rd, Royapettah, Chennai", totalSlots: 50, lat: 13.0587, lng: 80.2641, type: "Mall" },
      { name: "Phoenix Marketcity", address: "Velachery Main Rd, Velachery, Chennai", totalSlots: 100, lat: 12.9915, lng: 80.2223, type: "Mall" },
      { name: "Sathyam Cinemas (SPI)", address: "Thiru Vi Ka Rd, Royapettah, Chennai", totalSlots: 30, lat: 13.0519, lng: 80.2612, type: "Theater" },
      { name: "Forum Vijaya Mall", address: "Arcot Rd, Vadapalani, Chennai", totalSlots: 40, lat: 13.0501, lng: 80.2088, type: "Mall" },
      { name: "Rohini Silver Screens", address: "Poonamallee High Rd, Koyambedu, Chennai", totalSlots: 25, lat: 13.0782, lng: 80.1983, type: "Theater" },
      { name: "Marina Beach Parking", address: "Kamarajar Salai, Marina Beach, Chennai", totalSlots: 80, lat: 13.05, lng: 80.2824, type: "General" },
      { name: "Chennai Central Railway Station", address: "Kannappar Thidal, Periamet, Chennai", totalSlots: 60, lat: 13.0827, lng: 80.2707, type: "General" },
      { name: "Tambaram Railway Station", address: "Tambaram, Chennai", totalSlots: 100, lat: 12.9257, lng: 80.1316, type: "General" },
    ];

    const areas = await Area.insertMany(chennaiAreas);

    for (const area of areas) {
      const slots = [];
      for (let i = 1; i <= area.totalSlots; i++) {
        slots.push({
          area: area._id,
          slotNumber: `P-${i}`,
          isBooked: Math.random() < 0.3,
          pricePerHour: 20,
        });
      }
      await Slot.insertMany(slots);
    }

    res.status(201).json({ message: "Chennai parking data seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAreaWithSlots = async (req, res) => {
  const { name, address, lat, lng, type, totalSlots, pricePerHour } = req.body;
  try {
    const area = new Area({
      name,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type: type || "General",
      totalSlots: parseInt(totalSlots) || 10,
    });

    await area.save();

    const slots = [];
    const count = parseInt(totalSlots) || 10;
    const price = parseFloat(pricePerHour) || 20;
    for (let i = 1; i <= count; i++) {
      slots.push({
        area: area._id,
        slotNumber: `P-${i}`,
        isBooked: false,
        pricePerHour: price,
      });
    }
    await Slot.insertMany(slots);

    res.status(201).json({ message: "Parking area and slots created successfully", area });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const url =
      `https://nominatim.openstreetmap.org/reverse?format=json` +
      `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DigiPark/1.0 (https://digipark-ten.vercel.app)",
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ message: "Geocoding service unavailable" });
    }

    const data = await response.json();
    const { name, address } = parseNominatimResponse(data);

    res.json({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      address,
      displayName: data.display_name || address,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
