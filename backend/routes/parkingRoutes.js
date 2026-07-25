const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parkingController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const customer = require("../middleware/customer");

router.get("/areas", parkingController.getAreas);
router.get("/areas/:areaId/slots", parkingController.getAreaSlots);

router.post("/book", auth, customer, parkingController.bookSlot);
router.get("/bookings", auth, parkingController.getBookings);
router.get("/bookings/:id", auth, parkingController.getBookingById);
router.get("/transactions", auth, parkingController.getTransactions);
router.get("/stats/customer", auth, customer, parkingController.getCustomerStats);

router.get("/all-bookings", auth, admin, parkingController.getAllBookings);
router.put("/bookings/:id/status", auth, admin, parkingController.updateBookingStatus);
router.get("/all-transactions", auth, admin, parkingController.getAllTransactions);
router.get("/stats", auth, admin, parkingController.getStats);

router.get("/slots", auth, admin, parkingController.getAllSlots);
router.post("/slots", auth, admin, parkingController.createSlot);
router.put("/slots/:id", auth, admin, parkingController.updateSlot);
router.delete("/slots/:id", auth, admin, parkingController.deleteSlot);

router.put("/areas/:id", auth, admin, parkingController.updateArea);
router.delete("/areas/:id", auth, admin, parkingController.deleteArea);
router.post("/areas", auth, admin, parkingController.createAreaWithSlots);
router.get("/reverse-geocode", auth, admin, parkingController.reverseGeocode);

router.post("/seed", auth, admin, parkingController.seedData);

module.exports = router;
