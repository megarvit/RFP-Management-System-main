import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rfpRoutes from "./routes/rfpRoutes.js";
import dotenv from "dotenv";
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

app.use("/api/rfp", rfpRoutes);
app.use("/api/vendor", vendorRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Backend running on port ${process.env.PORT || 5000}`);
});
