// import express from "express";
// import cors from "cors";
// import { config } from "dotenv";
// import rfpRoutes from "./routes/rfpRoutes.js";

// config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/rfp", rfpRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is running!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("Backend running on port", PORT);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/mongo.js";
import rfpRoutes from "./routes/rfpRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/rfp", rfpRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));

