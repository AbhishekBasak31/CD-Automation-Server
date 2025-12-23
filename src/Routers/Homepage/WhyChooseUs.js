import express from "express";
import {
  getWhyChooseUs,
  createWhyChooseUs,
  updateWhyChooseUs,
  deleteWhyChooseUs
} from "../../Controllers/Homepage/WhyChoseUs.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const HomeWhychooseUsRouter = express.Router();
const uploadMiddleware = upload.single("BgImg");

// Public Get
HomeWhychooseUsRouter.get("/", getWhyChooseUs);

// Protected Routes
HomeWhychooseUsRouter.use(authenticate);

HomeWhychooseUsRouter.post("/", uploadMiddleware, createWhyChooseUs);
HomeWhychooseUsRouter.patch("/", uploadMiddleware, updateWhyChooseUs); // No ID needed
HomeWhychooseUsRouter.delete("/", deleteWhyChooseUs); // No ID needed

export default HomeWhychooseUsRouter;