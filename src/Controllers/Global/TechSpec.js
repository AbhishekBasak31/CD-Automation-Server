import mongoose from "mongoose";
import { TechSpec } from "../../Models/Global/Techspec.js";
import { Product } from "../../Models/Global/Product.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* ================= CREATE ================= */
export const createTechSpec = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { Key, value, ProductId } = req.body;

    if (!Key || !value || !ProductId) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Missing fields" });
    }

    const product = await Product.findById(ProductId).session(session);
    if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Product not found" });
    }

    const spec = new TechSpec({ Key: norm(Key), value: norm(value), ProductId });
    await spec.save({ session });

    await Product.findByIdAndUpdate(ProductId, { $push: { TechnicalSpecs: spec._id } }, { session });

    await session.commitTransaction();
    return res.status(201).json({ success: true, data: spec });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

/* ================= UPDATE ================= */
export const updateTechSpec = async (req, res) => {
  try {
    const { id } = req.params;
    const { Key, value } = req.body;

    const updates = {};
    if (Key) updates.Key = norm(Key);
    if (value) updates.value = norm(value);

    const spec = await TechSpec.findByIdAndUpdate(id, updates, { new: true });
    if (!spec) return res.status(404).json({ message: "TechSpec not found" });

    return res.status(200).json({ success: true, message: "TechSpec updated", data: spec });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteTechSpec = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    const spec = await TechSpec.findById(id).session(session);
    if (!spec) {
        await session.abortTransaction();
        return res.status(404).json({ message: "TechSpec not found" });
    }

    await Product.findByIdAndUpdate(spec.ProductId, { $pull: { TechnicalSpecs: id } }, { session });
    await TechSpec.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "TechSpec deleted" });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};