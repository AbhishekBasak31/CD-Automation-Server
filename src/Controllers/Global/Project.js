import mongoose from "mongoose";


import uploadOnCloudinary from "../../Utils/Clodinary.js";
import { isValidObjectId } from "mongoose";
import Project from "../../Models/Global/Projects.js";
import { HomeProjectSec } from "../../Models/HomePage/ProjectSection.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/**
 * Create Project
 * multipart/form-data:
 * - file: image (required) -> Mapped to 'Img'
 * - body: Htext, Dtext
 */
export const createProject = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const file = req.file;
    const Htext = norm(req.body.Htext);
    const Dtext = norm(req.body.Dtext);

    // 1. Validate required fields based on Schema
    const missing = [];
    if (!file) missing.push("Image (file)");
    if (!Htext) missing.push("Htext");
    if (!Dtext) missing.push("Dtext");

    if (missing.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missing.join(", ")}`,
      });
    }

    // 2. Upload Image to Cloudinary
    const upload = await uploadOnCloudinary(file.path);
    if (!upload) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    // 3. Create Project Document
    const project = new Project({
      Img: upload.secure_url || upload.url, // Schema field is Img
      Htext,
      Dtext,
    });

    await project.save({ session });

    // 4. Link to HomeProjectSec (Singleton logic: gets the latest/only section)
    const homeSec = await HomeProjectSec.findOne().sort({ createdAt: -1 }).session(session);
    
    // Optional: Auto-create HomeProjectSec if it doesn't exist (prevents error if user forgot)
    if (!homeSec) {
       // You might want to return 404 here, or handle it strictly. 
       // Keeping strict 404 as per previous logic.
       await session.abortTransaction();
       return res.status(404).json({
         success: false,
         message: "HomeProjectSec not found. Please create the Project Section first.",
       });
    }

    homeSec.Projects.push(project._id);
    await homeSec.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createProject error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get all projects
 */
export const getAllProjects = async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("getAllProjects error:", err);
    return res.status(500).json({ success: false, message: "Error fetching projects", error: err.message });
  }
};

/**
 * Get project by id
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    
    const doc = await Project.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Project not found" });
    
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ success: false, message: "Error fetching project", error: err.message });
  }
};

/**
 * Update project
 * multipart/form-data:
 * - optional file: image -> updates 'Img'
 * - optional body: Htext, Dtext
 */
export const updateProject = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const updates = {};

    if (req.body.Htext !== undefined) updates.Htext = norm(req.body.Htext);
    if (req.body.Dtext !== undefined) updates.Dtext = norm(req.body.Dtext);

    // Handle Image replacement
    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      if (!upload) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
      updates.Img = upload.secure_url || upload.url;
    }

    if (!Object.keys(updates).length) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, session }
    );

    if (!updated) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateProject error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Delete project
 * Removes project and pulls ID from HomeProjectSec
 */
export const deleteProject = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const deleted = await Project.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Remove reference from HomeProjectSec
    await HomeProjectSec.updateMany(
      {},
      { $pull: { Projects: deleted._id } },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteProject error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};