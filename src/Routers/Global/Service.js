import express from "express";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
} from "../../Controllers/Global/Service.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ServiceRouter = express.Router();

const uploadImages = upload.fields([
  { name: "Img1", maxCount: 1 },
  { name: "Img2", maxCount: 1 },
  { name: "Img3", maxCount: 1 },
  { name: "Img4", maxCount: 1 },
  { name: "Img5", maxCount: 1 },
]);

ServiceRouter.post("/", authenticate, uploadImages, createService);
ServiceRouter.get("/", getAllServices);
ServiceRouter.patch("/:id", authenticate, uploadImages, updateService);
ServiceRouter.delete("/:id", authenticate, deleteService);

export default ServiceRouter;
