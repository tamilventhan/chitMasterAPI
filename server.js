import cors from "cors";
import dotenv from "dotenv";   
import express from "express"; 
import mongoose from "mongoose";
import bodyParser from "body-parser";
import indexRoutes from './routes/indexRoutes.js';
import { apiMonitor } from "./routes/apiMonitor.js";

dotenv.config({ path: "./config/app.env" });

const app = express();

// ✅ Enable JSON Parsing Before Routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Support form data

// ✅ CORS Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ API Monitor
app.get("/", apiMonitor);

// ✅ Routes
app.use('/api', indexRoutes);

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.ENVIRONMENT || "Production";

app.listen(PORT, () => {
    console.log(`Server is running on ${ENVIRONMENT} mode http://localhost:${PORT}`);
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err.message);
        process.exit(1);
    });