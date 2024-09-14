import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({
  path: "./.env",
});

// Import routes
import authRoutes from "./Routes/auth.Routes.js";
import courseRoutes from "./Routes/course.Routes.js";

const app = express();
app.use(cors());
app.use(json());

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
