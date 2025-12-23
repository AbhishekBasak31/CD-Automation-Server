import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../../Controllers/Global/Reviews.js"
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ReviewRouter = express.Router();
const uploadMiddleware = upload.single("Img"); 

ReviewRouter.use(authenticate);

// Create (Multipart: Img + fields)
ReviewRouter.post("/", uploadMiddleware, createReview);

// Update (Multipart: optional Img + fields)
ReviewRouter.patch("/:id", uploadMiddleware, updateReview);

// Delete
ReviewRouter.delete("/:id", deleteReview);

export default ReviewRouter;