const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const releaseExpiredBookings = require("./utils/releaseExpiredBookings");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/parkingDB")
  .then(() => {
    console.log("MongoDB Connected");

    // Auto-release slots every 5 minutes when parking hours end
    releaseExpiredBookings().then((count) => {
      if (count > 0) console.log(`Released ${count} expired booking(s) on startup`);
    });

    setInterval(async () => {
      try {
        const count = await releaseExpiredBookings();
        if (count > 0) console.log(`Auto-released ${count} expired slot(s)`);
      } catch (err) {
        console.error("Auto-release error:", err.message);
      }
    }, 5 * 60 * 1000);
  })
  .catch((err) => console.log(err));

// Use routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parking", require("./routes/parkingRoutes"));

app.get("/", (req, res) => {
  res.send("Parking system backend is READY on port 5001!");
});

app.listen(5001, () => console.log("Server running on port 5001"));