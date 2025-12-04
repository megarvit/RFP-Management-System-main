import express from "express";
import cors from "cors";
import { config } from "dotenv";
import rfpRoutes from "./routes/rfpRoutes.js";

config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rfp", rfpRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
