import express from "express";
import {
  createAboutBanner,
  getAboutBanner,
  updateAboutBanner,
  deleteAboutBanner
} from "../../Controllers/AboutPage/Banner.js"; // Adjust path
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const AboutBannerRouter = express.Router();
const uploadMiddleware = upload.single("Img"); // Key must be 'Img'

// Public Route
AboutBannerRouter.get("/", getAboutBanner);

// Protected Routes
AboutBannerRouter.use(authenticate);

AboutBannerRouter.post("/", uploadMiddleware, createAboutBanner);
AboutBannerRouter.patch("/", uploadMiddleware, updateAboutBanner); // No ID required
AboutBannerRouter.delete("/", deleteAboutBanner); // No ID required

export default AboutBannerRouter;