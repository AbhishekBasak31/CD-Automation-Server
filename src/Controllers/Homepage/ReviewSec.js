import mongoose from "mongoose";
import { HomeReviewSec } from "../../Models/HomePage/ReviewSec.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE Review Section (Htext Only - No Image)
   ========================================================= */
export const createHomeReviewSec = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { Htext } = req.body;
    
    if (!Htext) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Htext is required" });
    }

    const sec = new HomeReviewSec({
      Htext: norm(Htext),
      Reviews: [], // Initialize empty array
    });

    await sec.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "HomeReviewSec created successfully",
      data: sec,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   GET ALL Review Sections
   ========================================================= */
export const getAllHomeReviewSec = async (req, res) => {
  try {
    const list = await HomeReviewSec.find()
      .sort({ createdAt: -1 })
      .populate("Reviews"); // Populate linked reviews

    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   UPDATE LATEST Review Section (Htext Only)
   ========================================================= */
export const updateHomeReviewSec = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const target = await HomeReviewSec.findOne().sort({ createdAt: -1 }).session(session);
    
    if (!target) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeReviewSec found to update" });
    }

    const updates = {};
    if (req.body.Htext !== undefined) updates.Htext = norm(req.body.Htext);

    const updated = await HomeReviewSec.findByIdAndUpdate(
      target._id,
      updates,
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Updated successfully", data: updated });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   DELETE LATEST Review Section
   ========================================================= */
export const deleteHomeReviewSec = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const latest = await HomeReviewSec.findOne().sort({ createdAt: -1 }).session(session);

    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No HomeReviewSec found to delete",
      });
    }

    const deleted = await HomeReviewSec.findByIdAndDelete(latest._id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeReviewSec deleted successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteHomeReviewSec error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });

  } finally {
    session.endSession();
  }
};
