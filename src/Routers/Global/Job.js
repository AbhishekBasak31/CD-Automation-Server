import express from "express";
import {
  createJob,
  getAllJobs,
  getJobBySlug,
  updateJob,
  deleteJob
} from "../../Controllers/Global/Job.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js"; // Assuming you have auth

const JobRouter = express.Router();

/* ================= PUBLIC ROUTES ================= */
JobRouter.get("/", getAllJobs);
JobRouter.get("/:slug", getJobBySlug); // Use slug for pretty URLs in frontend

/* ================= PROTECTED ROUTES (Admin) ================= */
JobRouter.use(authenticate);

// Create
JobRouter.post("/", createJob);

// Update
JobRouter.patch("/:id", updateJob);

// Delete
JobRouter.delete("/:id", deleteJob);

export default JobRouter;