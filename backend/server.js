import path from "path";
import uploadRoutes from "./routes/uploadRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import carRoutes from "./routes/carRoutes.js"; 
import bookingRoutes from "./routes/bookingRoutes.js"; 
import settingsRoutes from "./routes/settingsRoutes.js"; // <-- NEW: Import settings routes

// Load our secret variables
dotenv.config();

// Fire up the database connection
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// A simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Nandi Cars Backend is running successfully!" });
});

// Route connections
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes); 
app.use("/api/upload", uploadRoutes);
app.use("/api/bookings", bookingRoutes); 
app.use("/api/settings", settingsRoutes); // <-- NEW: Connect the global settings doorway

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running beautifully on port ${PORT}`);
});