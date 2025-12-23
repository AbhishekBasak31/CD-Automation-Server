import mongoose from "mongoose";
import { Application } from "../../Models/Global/Application.js";
import { Product } from "../../Models/Global/Product.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: apps });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createApplication = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { application, ProductId } = req.body;
    const file = req.file;

    if (!application || !ProductId || !file) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Missing fields" });
    }

    const up = await uploadOnCloudinary(file.path);
    if (!up) {
        await session.abortTransaction();
        return res.status(500).json({ message: "Image upload failed" });
    }

    const appDoc = new Application({
      application: norm(application),
      img: up.secure_url || up.url,
      ProductId
    });

    await appDoc.save({ session });
    await Product.findByIdAndUpdate(ProductId, { $push: { Application: appDoc._id } }, { session });

    await session.commitTransaction();
    return res.status(201).json({ success: true, data: appDoc });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const deleteApplication = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    const appDoc = await Application.findById(id).session(session);
    if (!appDoc) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Not Found" });
    }

    await Product.findByIdAndUpdate(appDoc.ProductId, { $pull: { Application: id } }, { session });
    await Application.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};
/* ================= UPDATE ================= */
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { application } = req.body;
    const file = req.file;

    const updates = {};
    if (application) updates.application = norm(application);

    if (file) {
        const up = await uploadOnCloudinary(file.path);
        if (up) updates.img = up.secure_url || up.url;
    }

    const appDoc = await Application.findByIdAndUpdate(id, updates, { new: true });
    if (!appDoc) return res.status(404).json({ message: "Application not found" });

    return res.status(200).json({ success: true, message: "Updated", data: appDoc });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

