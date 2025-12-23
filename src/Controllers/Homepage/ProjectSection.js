import mongoose from "mongoose";
import { HomeProjectSec } from "../../Models/HomePage/ProjectSection.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =====================================================
   CREATE HomeProjectSec
   (Only Htext required, Dtext removed from schema)
===================================================== */
export const createHomeProjectSec = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const Htext = norm(req.body?.Htext);

    if (!Htext) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Htext is required",
      });
    }

    const section = new HomeProjectSec({
      Htext,
      Projects: [], // Empty initially, populated by Project controller
    });

    await section.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "HomeProjectSec created successfully",
      data: section,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createHomeProjectSec error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   GET ALL HomeProjectSec
===================================================== */
export const getAllHomeProjectSec = async (req, res) => {
  try {
    const list = await HomeProjectSec.find()
      .populate("Projects")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: list,
    });

  } catch (err) {
    console.error("getAllHomeProjectSec error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/* =====================================================
   GET LATEST HomeProjectSec
===================================================== */
export const getLatestHomeProjectSec = async (req, res) => {
  try {
    const latest = await HomeProjectSec.findOne()
      .populate("Projects")
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No HomeProjectSec found",
      });
    }

    return res.status(200).json({
      success: true,
      data: latest,
    });

  } catch (err) {
    console.error("getLatestHomeProjectSec error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/* =====================================================
   UPDATE LATEST HomeProjectSec
   (Only Htext update allowed)
===================================================== */
export const updateHomeProjectSec = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const latest = await HomeProjectSec.findOne()
      .sort({ createdAt: -1 })
      .session(session);

    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No HomeProjectSec found to update",
      });
    }

    const updates = {};
    if (req.body.Htext !== undefined) {
      updates.Htext = norm(req.body.Htext);
    }
    // Dtext logic removed to match schema

    const updated = await HomeProjectSec.findByIdAndUpdate(
      latest._id,
      updates,
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeProjectSec updated successfully",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateHomeProjectSec error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   DELETE LATEST HomeProjectSec
===================================================== */
export const deleteHomeProjectSec = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const latest = await HomeProjectSec.findOne()
      .sort({ createdAt: -1 })
      .session(session);

    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No HomeProjectSec found to delete",
      });
    }

    const deleted = await HomeProjectSec.findByIdAndDelete(latest._id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeProjectSec deleted successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteHomeProjectSec error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};