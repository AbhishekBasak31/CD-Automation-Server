import express from "express";
import {
  createAboutPage,
  getAboutPage,
  updateAboutPage
} from "../../Controllers/AboutPage/AboutPage.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const AboutPageRouter = express.Router();

// Defined explicitly for each single file field
const uploadMiddleware = upload.fields([
  { name: 'BannerImg', maxCount: 1 },
  { name: 'WhoweareImg', maxCount: 1 },
  { name: 'WhychooseusCardIcon1', maxCount: 1 },
  { name: 'WhychooseusCardIcon2', maxCount: 1 },
  { name: 'WhychooseusCardIcon3', maxCount: 1 }
]);

/* ================= PUBLIC ROUTES ================= */
AboutPageRouter.get("/", getAboutPage); 

/* ================= PROTECTED ROUTES ================= */
AboutPageRouter.use(authenticate);

// Create
AboutPageRouter.post("/", uploadMiddleware, createAboutPage);

// Update
AboutPageRouter.patch("/", uploadMiddleware, updateAboutPage);

export default AboutPageRouter;