const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const releaseExpiredBookings = require("./utils/releaseExpiredBookings");

const app = express();
const PORT = process.env.PORT || 5001;

const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim()).filter(Boolean)
  : null;

app.use(cors(clientUrls?.length ? { origin: clientUrls } : {}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/parkingDB")
  .then(() => {
    console.log("MongoDB Connected");

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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parking", require("./routes/parkingRoutes"));

app.get("/", (req, res) => {
  res.send(`DigiPark API is running on port ${PORT}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
