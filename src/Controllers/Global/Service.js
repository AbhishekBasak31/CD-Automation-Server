import mongoose from "mongoose";
import { Service } from "../../Models/Global/Service.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =====================================================
   CREATE Service
===================================================== */
export const createService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const files = req.files || {};
    const {
      Htext,
      Dtext,
      tag,
      bulletpoint1,
      bulletpoint2,
      bulletpoint3,
      bulletpoint4

    } = req.body;

    // 1. Validate Fields
    const missing = [];
    if (!Htext) missing.push("Htext");
    if (!Dtext) missing.push("Dtext");
    if (!tag) missing.push("tag");
    if (!bulletpoint1) missing.push("bulletpoint1");
    if (!bulletpoint2) missing.push("bulletpoint2");
    if (!bulletpoint3) missing.push("bulletpoint3");
    if (!bulletpoint4) missing.push("bulletpoint4");


    ["Img1", "Img2", "Img3"].forEach((k) => {
      if (!files[k]?.[0]) missing.push(k);
    });

    if (missing.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missing.join(", ")}`,
      });
    }

    // 2. Upload images
    const uploads = {};
    for (const key of ["Img1", "Img2", "Img3"]) {
      const up = await uploadOnCloudinary(files[key][0].path);
      if (!up) {
          await session.abortTransaction();
          return res.status(500).json({ success: false, message: `Failed to upload ${key}` });
      }
      uploads[key] = up.secure_url || up.url;
    }

    // 3. Create Service
    const service = new Service({
      ...uploads,
      Htext: norm(Htext),
      Dtext: norm(Dtext),
      tag: norm(tag),
      bulletpoint1: norm(bulletpoint1),
      bulletpoint2: norm(bulletpoint2),
      bulletpoint3: norm(bulletpoint3),
      bulletpoint4: norm(bulletpoint4),

    });

    await service.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createService error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   GET ALL Services
===================================================== */
export const getAllServices = async (req, res) => {
  try {
    const list = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    console.error("getAllServices error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   UPDATE Service
===================================================== */
export const updateService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid service id" });
    }

    const updates = {};
    const fields = [
      "Htext", "Dtext", "tag", 
      "bulletpoint1", "bulletpoint2", "bulletpoint3","bulletpoint4"
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = norm(req.body[f]);
    });

    if (req.files) {
      for (const key of ["Img1", "Img2", "Img3"]) {
        if (req.files[key]?.[0]) {
          const up = await uploadOnCloudinary(req.files[key][0].path);
          updates[key] = up.secure_url || up.url;
        }
      }
    }

    const updated = await Service.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, session }
    );

    if (!updated) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* =====================================================
   DELETE Service
===================================================== */
export const deleteService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid service id" });
    }

    const deleted = await Service.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};