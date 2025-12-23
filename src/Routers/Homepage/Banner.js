import express from "express";
import {
  createHomeBanner,
  getAllHomeBanners,
  getLatestHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
} from "../../Controllers/Homepage/Banner.js"; // Ensure this path matches where you saved the controller

import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const HomeBannerRouter = express.Router();

/**
 * MULTER CONFIGURATION
 * Must match the Schema fields exactly.
 * - 3 Hero Images (Img1, Img2, Img3)
 * - 3 Card Logos (CardLogo1, CardLogo2, CardLogo3)
 */
const bannerFields = upload.fields([
  // Hero Images
  { name: "Img1", maxCount: 1 },
  { name: "Img2", maxCount: 1 },
  { name: "Img3", maxCount: 1 },
  
  // Card Logos
  { name: "CardLogo1", maxCount: 1 },
  { name: "CardLogo2", maxCount: 1 },
  { name: "CardLogo3", maxCount: 1 },
]);

/* ================= ROUTES ================= */

// Create New Banner
HomeBannerRouter.post("/", authenticate, bannerFields, createHomeBanner);

// Get All Banners
HomeBannerRouter.get("/", getAllHomeBanners);

// Get Latest Banner (Useful for Frontend)
HomeBannerRouter.get("/latest", getLatestHomeBanner);

// Update Latest Banner (Files are optional in controller logic)
HomeBannerRouter.patch("/", authenticate, bannerFields, updateHomeBanner);

// Delete Latest Banner
HomeBannerRouter.delete("/", authenticate, deleteHomeBanner);

export default HomeBannerRouter;