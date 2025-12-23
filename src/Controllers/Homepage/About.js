// Server/src/Controller/Global/HomeAbout.js
import mongoose from "mongoose";
import {HomeAbout} from "../../Models/HomePage/About.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";
import { isValidObjectId } from "mongoose";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/**
 * Create HomeAbout
 * multipart/form-data:
 *   - files: Img1, Img2 (required)
 *   - body: Htext, Dtext, Tag1, Tag2, Tag3,
 *           Tag1bp1..Tag1bp3, Tag2bp1..Tag2bp3, Tag3bp1..Tag3bp3
 */
export const createHomeAbout = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const files = req.files || {};
    const file1 = files.Img1?.[0];
    const file2 = files.Img2?.[0];

    // Basic normalized fields
    const Htext = norm(req.body.Htext);
    const Dtext = norm(req.body.Dtext);
    const Tag1 = norm(req.body.Tag1);
    const Tag2 = norm(req.body.Tag2);
    const Tag3 = norm(req.body.Tag3);

    // bullet points (expected names from model)
    const Tag1bp1 = norm(req.body.Tag1bp1);
    const Tag1bp2 = norm(req.body.Tag1bp2);
    const Tag1bp3 = norm(req.body.Tag1bp3);

    const Tag2bp1 = norm(req.body.Tag2bp1);
    const Tag2bp2 = norm(req.body.Tag2bp2);
    const Tag2bp3 = norm(req.body.Tag2bp3);

    const Tag3bp1 = norm(req.body.Tag3bp1);
    const Tag3bp2 = norm(req.body.Tag3bp2);
    const Tag3bp3 = norm(req.body.Tag3bp3);

    const missing = [];
    if (!file1) missing.push("Img1 file");
    if (!file2) missing.push("Img2 file");
    if (!Htext) missing.push("Htext");
    if (!Dtext) missing.push("Dtext");
    if (!Tag1) missing.push("Tag1");
    if (!Tag2) missing.push("Tag2");
    if (!Tag3) missing.push("Tag3");
    // require bullet points as model indicates
    if (!Tag1bp1) missing.push("Tag1bp1");
    if (!Tag1bp2) missing.push("Tag1bp2");
    if (!Tag1bp3) missing.push("Tag1bp3");

    if (!Tag2bp1) missing.push("Tag2bp1");
    if (!Tag2bp2) missing.push("Tag2bp2");
    if (!Tag2bp3) missing.push("Tag2bp3");

    if (!Tag3bp1) missing.push("Tag3bp1");
    if (!Tag3bp2) missing.push("Tag3bp2");
    if (!Tag3bp3) missing.push("Tag3bp3");

    if (missing.length) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Missing required: ${missing.join(", ")}` });
    }

    // Upload images to Cloudinary
    const up1 = await uploadOnCloudinary(file1.path);
    if (!up1) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Img1 upload failed" });
    }
    const up2 = await uploadOnCloudinary(file2.path);
    if (!up2) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Img2 upload failed" });
    }

    const doc = new HomeAbout({
      Img1: up1.secure_url || up1.url || "",
      Img2: up2.secure_url || up2.url || "",
      Htext,
      Dtext,
      Tag1,
      Tag2,
      Tag3,
      Tag1bp1, Tag1bp2, Tag1bp3,
      Tag2bp1, Tag2bp2, Tag2bp3,
      Tag3bp1, Tag3bp2, Tag3bp3,
    });

    await doc.save({ session });
    await session.commitTransaction();

    return res.status(201).json({ success: true, message: "HomeAbout created.", data: doc });
  } catch (err) {
    try { if (session.inTransaction()) await session.abortTransaction(); } catch (e) { console.error("abortTransaction err:", e); }
    console.error("createHomeAbout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Get all HomeAbout entries
 */
export const getAllHomeAbout = async (req, res) => {
  try {
    const items = await HomeAbout.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("getAllHomeAbout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * Get latest HomeAbout
 */
export const getLatestHomeAbout = async (req, res) => {
  try {
    const latest = await HomeAbout.findOne({}).sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ success: false, message: "No HomeAbout found" });
    return res.status(200).json({ success: true, data: latest });
  } catch (err) {
    console.error("getLatestHomeAbout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * Get by id
 */
export const getHomeAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const doc = await HomeAbout.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "HomeAbout not found" });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("getHomeAboutById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * Update HomeAbout
 * If :id param present -> update that doc
 * Else updates latest document
 * Accepts multipart/form-data: optional Img1/Img2 files and any text fields
 */
export const updateHomeAbout = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // determine target doc: by id or latest
    let target = null;
    if (req.params && req.params.id) {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      target = await HomeAbout.findById(id).session(session).lean();
    } else {
      target = await HomeAbout.findOne({}).sort({ createdAt: -1 }).session(session).lean();
    }

    if (!target) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeAbout found to update." });
    }

    const updates = {};
    // text fields (if provided)
    const body = req.body || {};
    const textKeys = [
      "Htext","Dtext","Tag1","Tag2","Tag3",
      "Tag1bp1","Tag1bp2","Tag1bp3",
      "Tag2bp1","Tag2bp2","Tag2bp3",
      "Tag3bp1","Tag3bp2","Tag3bp3"
    ];
    textKeys.forEach((k) => {
      if (typeof body[k] !== "undefined") {
        const v = norm(body[k]);
        // allow empty string? we enforce non-empty when provided
        if (!v) {
          // abort if user provided empty string
          // you can change to allow clearing by passing "" explicitly
          throw new Error(`${k} must be a non-empty string if provided`);
        }
        updates[k] = v;
      }
    });

    // file handling (optional replacement)
    const files = req.files || {};
    if (files.Img1?.[0]) {
      const up = await uploadOnCloudinary(files.Img1[0].path);
      if (!up) {
        if (session.inTransaction()) await session.abortTransaction();
        return res.status(500).json({ success: false, message: "Img1 upload failed." });
      }
      updates.Img1 = up.secure_url || up.url || "";
    }
    if (files.Img2?.[0]) {
      const up = await uploadOnCloudinary(files.Img2[0].path);
      if (!up) {
        if (session.inTransaction()) await session.abortTransaction();
        return res.status(500).json({ success: false, message: "Img2 upload failed." });
      }
      updates.Img2 = up.secure_url || up.url || "";
    }

    if (Object.keys(updates).length === 0) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(400).json({ success: false, message: "No fields provided to update." });
    }

    const updated = await HomeAbout.findByIdAndUpdate(target._id, { $set: updates }, { new: true, runValidators: true, session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "HomeAbout updated.", data: updated });
  } catch (err) {
    try { if (session.inTransaction()) await session.abortTransaction(); } catch (e) { console.error("abortTransaction err:", e); }
    console.error("updateHomeAbout error:", err);
    // validation error or thrown error message
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    return res.status(400).json({ success: false, message: err.message || "Internal server error", error: err.stack || err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Delete HomeAbout
 * If :id param present -> delete that doc
 * Else -> delete latest
 */
export const deleteHomeAbout = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let target = null;
    if (req.params && req.params.id) {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      target = await HomeAbout.findById(id).session(session).lean();
    } else {
      target = await HomeAbout.findOne({}).sort({ createdAt: -1 }).session(session).lean();
    }

    if (!target) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeAbout found to delete." });
    }

    const deleted = await HomeAbout.findByIdAndDelete(target._id, { session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "HomeAbout deleted.", data: deleted });
  } catch (err) {
    try { if (session.inTransaction()) await session.abortTransaction(); } catch (e) { console.error("abortTransaction err:", e); }
    console.error("deleteHomeAbout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};