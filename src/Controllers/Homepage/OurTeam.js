import mongoose from "mongoose";
import { HomeOurteam } from "../../Models/HomePage/OurTeam.js";


const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE HomeOurteam (ONLY Htext, Dtext)
   ========================================================= */
export const createHomeOurteam = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { Htext, Dtext } = req.body;

    const missing = [];
    if (!Htext) missing.push("Htext");
    if (!Dtext) missing.push("Dtext");

    if (missing.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing: ${missing.join(", ")}`
      });
    }

    const doc = new HomeOurteam({
      Htext: norm(Htext),
      Dtext: norm(Dtext),
      Ourteam: [], // empty array
    });

    await doc.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "HomeOurteam created successfully",
      data: doc,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createHomeOurteam error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


/* =========================================================
   GET ALL
   ========================================================= */
export const getAllHomeOurteam = async (req, res) => {
  try {
    const list = await HomeOurteam.find()
      .populate("Ourteam")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: list });

  } catch (err) {
    console.error("getAllHomeOurteam error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================================================
   GET LATEST
   ========================================================= */
export const getLatestHomeOurteam = async (req, res) => {
  try {
    const latest = await HomeOurteam.findOne()
      .populate("Ourteam")
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ success: false, message: "No HomeOurteam found" });
    }

    return res.status(200).json({ success: true, data: latest });

  } catch (err) {
    console.error("getLatestHomeOurteam error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================================================
   UPDATE latest (ONLY Htext, Dtext)
   ========================================================= */
export const updateHomeOurteam = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { Htext, Dtext } = req.body;

    const target = await HomeOurteam.findOne().sort({ createdAt: -1 }).session(session);

    if (!target) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeOurteam to update" });
    }

    const updates = {};
    if (Htext !== undefined) updates.Htext = norm(Htext);
    if (Dtext !== undefined) updates.Dtext = norm(Dtext);

    const updated = await HomeOurteam.findByIdAndUpdate(
      target._id,
      updates,
      {
        new: true,
        runValidators: true,
        session,
      }
    ).populate("Ourteam");

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeOurteam updated successfully",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateHomeOurteam error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


/* =========================================================
   DELETE LATEST
   ========================================================= */
export const deleteHomeOurteam = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const latest = await HomeOurteam.findOne().sort({ createdAt: -1 }).session(session);

    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeOurteam found" });
    }

    const deleted = await HomeOurteam.findByIdAndDelete(latest._id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeOurteam deleted successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteHomeOurteam error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
