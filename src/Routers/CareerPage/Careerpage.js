import express from "express";
import {
  createCareerPage,
  getCareerPage,
  updateCareerPage
} from "../../Controllers/CareerPage/Careerpage.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const CareerPageRouter = express.Router();

// Middleware for Multiple Icon Fields
const uploadFields = upload.fields([
  { name: 'WhyJoinUsCardIcon1', maxCount: 1 },
  { name: 'WhyJoinUsCardIcon2', maxCount: 1 },
  { name: 'WhyJoinUsCardIcon3', maxCount: 1 }
]);

/* ================= PUBLIC ROUTES ================= */
CareerPageRouter.get("/", getCareerPage);

/* ================= PROTECTED ROUTES ================= */
CareerPageRouter.use(authenticate);

// Create
CareerPageRouter.post("/", uploadFields, createCareerPage);

// Update (No ID required)
CareerPageRouter.patch("/", uploadFields, updateCareerPage);

export default CareerPageRouter;