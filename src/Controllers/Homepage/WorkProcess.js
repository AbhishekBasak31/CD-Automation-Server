import mongoose from "mongoose";
import { HomeWorkProcess } from "../../Models/HomePage/WorkProcess.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =====================================================
   CREATE (New Work Process)
===================================================== */
export const newWorkProcess = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const body = req.body || {};

    // 1. Validate Required Main Fields
    const MainHtext = norm(body.MainHtext);
    const MainDtext = norm(body.MainDtext);

    if (!MainHtext || !MainDtext) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "MainHtext and MainDtext are required." });
    }

    // 2. Validate Required Cards (1-5)
    const requiredCards = [1, 2, 3, 4, 5];
    const missingFields = [];

    requiredCards.forEach((i) => {
      if (!norm(body[`Card${i}Stepno`])) missingFields.push(`Card${i}Stepno`);
      if (!norm(body[`Card${i}Name`])) missingFields.push(`Card${i}Name`);
      if (!norm(body[`Card${i}Dtext`])) missingFields.push(`Card${i}Dtext`);
    });



    if (missingFields.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    // 3. Build Document Object
    const doc = {
      MainHtext,
      MainDtext,
    };

    // Loop through all potential cards (1 to 10)
    for (let i = 1; i <= 10; i++) {
      const step = norm(body[`Card${i}Stepno`]);
      const name = norm(body[`Card${i}Name`]);
      const desc = norm(body[`Card${i}Dtext`]);

      // Only add to doc if at least one field exists (for optional cards 6-10)
      // For required cards (1-5), validation passed above, so they will be added.
      if (step !== undefined) doc[`Card${i}Stepno`] = step;
      if (name !== undefined) doc[`Card${i}Name`] = name;
      if (desc !== undefined) doc[`Card${i}Dtext`] = desc;
    }

    const instance = new HomeWorkProcess(doc);
    await instance.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "WorkProcess created successfully.",
      data: instance,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("newWorkProcess error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   GET ALL
===================================================== */
export const getAllWorkProcesses = async (req, res) => {
  try {
    const items = await HomeWorkProcess.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("getAllWorkProcesses error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/* =====================================================
   UPDATE (Updates Latest)
===================================================== */
export const updateWorkProcess = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const body = req.body || {};
    const id = body.id ?? null;

    let target;
    if (id) {
      target = await HomeWorkProcess.findById(id).session(session);
    } else {
      target = await HomeWorkProcess.findOne().sort({ createdAt: -1 }).session(session);
    }

    if (!target) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No WorkProcess found to update." });
    }

    const updates = {};

    // Update Main Text
    if (body.MainHtext !== undefined) updates.MainHtext = norm(body.MainHtext);
    if (body.MainDtext !== undefined) updates.MainDtext = norm(body.MainDtext);

    // Update Cards 1-10
    for (let i = 1; i <= 10; i++) {
      if (body[`Card${i}Stepno`] !== undefined) updates[`Card${i}Stepno`] = norm(body[`Card${i}Stepno`]);
      if (body[`Card${i}Name`] !== undefined) updates[`Card${i}Name`] = norm(body[`Card${i}Name`]);
      if (body[`Card${i}Dtext`] !== undefined) updates[`Card${i}Dtext`] = norm(body[`Card${i}Dtext`]);
    }

    const updated = await HomeWorkProcess.findByIdAndUpdate(target._id, updates, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "WorkProcess updated successfully.",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateWorkProcess error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   DELETE (Deletes Latest)
===================================================== */
export const deleteWorkProcess = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const id = req.body?.id ?? null;
    let target;

    if (id) {
      target = await HomeWorkProcess.findById(id).session(session);
    } else {
      target = await HomeWorkProcess.findOne().sort({ createdAt: -1 }).session(session);
    }

    if (!target) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No WorkProcess found to delete." });
    }

    const deleted = await HomeWorkProcess.findByIdAndDelete(target._id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "WorkProcess deleted successfully.",
      data: deleted,
    });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteWorkProcess error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};