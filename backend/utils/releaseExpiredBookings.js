const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

/**
 * Marks expired active bookings as completed and frees their slots
 * so the same slot can be booked again after parking hours end.
 */
async function releaseExpiredBookings() {
  const now = new Date();

  const expiredBookings = await Booking.find({
    status: "active",
    endTime: { $lt: now },
  });

  if (expiredBookings.length === 0) return 0;

  const slotIds = [...new Set(expiredBookings.map((b) => b.slot.toString()))];

  await Booking.updateMany(
    { _id: { $in: expiredBookings.map((b) => b._id) } },
    { $set: { status: "completed" } }
  );

  for (const slotId of slotIds) {
    const stillActive = await Booking.findOne({
      slot: slotId,
      status: "active",
      endTime: { $gte: now },
    });

    if (!stillActive) {
      await Slot.findByIdAndUpdate(slotId, { isBooked: false });
    }
  }

  return expiredBookings.length;
}

module.exports = releaseExpiredBookings;
