import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../../Controllers/Global/Project.js"; 
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ProjectRouter = express.Router();

// Middleware for single image upload (Key must be "Img" in frontend)
const uploadMiddleware = upload.single("Img");

/* ================= PUBLIC ROUTES ================= */
ProjectRouter.get("/", getAllProjects);

ProjectRouter.get("/:id", getProjectById);

/* ================= PROTECTED ROUTES ================= */
ProjectRouter.use(authenticate);

// Create: Requires 'Img', 'Htext', 'Dtext'
ProjectRouter.post("/", uploadMiddleware, createProject);

// Update: ID required. Optional 'Img', 'Htext', 'Dtext'
ProjectRouter.patch("/:id", uploadMiddleware, updateProject);

// Delete: ID required
ProjectRouter.delete("/:id", deleteProject);

export default ProjectRouter;