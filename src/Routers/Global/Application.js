import express from "express";
import { createApplication, updateApplication, deleteApplication } from "../../Controllers/Global/Application.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ApplicationRouter = express.Router();
const uploadMiddleware = upload.single("img");

ApplicationRouter.use(authenticate);

ApplicationRouter.post("/", uploadMiddleware, createApplication);
ApplicationRouter.patch("/:id", uploadMiddleware, updateApplication);
ApplicationRouter.delete("/:id", deleteApplication);

export default ApplicationRouter;