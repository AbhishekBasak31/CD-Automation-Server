import { Job } from "../../Models/Global/Job.js";

// ============================
// 1. Create Job (Admin)
// ============================
export const createJob = async (req, res) => {
  try {
    const { 
      title, department, location, type, 
      description, salary, experience, tags, 
      requirements, responsibilities 
    } = req.body;

    // Basic Validation
    if (!title || !department || !location || !description) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    const newJob = new Job({
      title,
      department,
      location,
      type,
      description,
      salary,
      experience,
      tags: Array.isArray(tags) ? tags : tags?.split(","), // Handle both array or comma-string
      requirements: Array.isArray(requirements) ? requirements : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job opening created successfully",
      data: newJob,
    });
  } catch (err) {
    console.error("Create Job Error:", err);
    // Handle duplicate slug error
    if (err.code === 11000) {
        return res.status(400).json({ error: "A job with this title already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 2. Get All Active Jobs (Public)
// ============================
export const getAllJobs = async (req, res) => {
  try {
    // Only fetch active jobs, sort by newest
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 3. Get Single Job by Slug
// ============================
export const getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const job = await Job.findOne({ slug, isActive: true });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 4. Update Job (Admin)
// ============================
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedJob) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 5. Delete Job (Admin)
// ============================
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};