// Server/src/Routes/homeAboutRoutes.js
import express from "express";
import {
  createHomeAbout,
  getAllHomeAbout,
  getLatestHomeAbout,
  getHomeAboutById,
  updateHomeAbout,
  deleteHomeAbout,
} from "../../Controllers/Homepage/About.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const HomeAboutRouter= express.Router();

// multer fields for Img1 and Img2
const imageFields = upload.fields([
  { name: "Img1", maxCount: 1 },
  { name: "Img2", maxCount: 1 },
]);

/**
 * Public
 */
HomeAboutRouter.get("/", getAllHomeAbout);

/**
 * Protected
 */
HomeAboutRouter.post("/", authenticate, imageFields, createHomeAbout);

// Update latest if no :id, or update specific id when provided
HomeAboutRouter.patch("/", authenticate, imageFields, updateHomeAbout);


// Delete latest if no :id, or delete specific id when provided
HomeAboutRouter.delete("/", authenticate, deleteHomeAbout);


export default HomeAboutRouter;
