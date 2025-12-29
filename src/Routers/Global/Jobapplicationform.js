import express from "express";
import { 
  applyForJob, 
  getAllApplications, // Import the new function
  updateApplicationStatus,
  deleteApplication,
  getApplicationbyID
} from "../../Controllers/Global/JobApplicationForm.js";
import { upload } from "../../Middleware/Multer.js";

const jobapplicationrouter = express();

// 1. Submit Application
jobapplicationrouter.route("/").post(upload.single("resume"), applyForJob);

// 2. Get ALL Applications (Admin Global Feed)
// Place this BEFORE the /:id route so "all" isn't treated as an ID
jobapplicationrouter.route("/").get(getAllApplications); 

// 3. Single Application Operations (Get One, Update, Delete)
jobapplicationrouter.route("/:id")
  .get(getApplicationbyID)
  .patch(updateApplicationStatus)
  .delete(deleteApplication);

export default jobapplicationrouter;