import mongoose from "mongoose";
import { Product } from "../../Models/Global/Product.js";
import { ProductBrand } from "../../Models/Global/Brand.js";
import { TechSpec } from "../../Models/Global/Techspec.js";
import { Application } from "../../Models/Global/Application.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* ================= CREATE ================= */
export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { 
      name, Dtext, BrandId, 
      KeyHighlights1, KeyHighlights2, KeyHighlights3, KeyHighlights4, KeyHighlights5,
      // Optional extra highlights
      KeyHighlights6, KeyHighlights7, KeyHighlights8, KeyHighlights9, KeyHighlights10
    } = req.body;

    const files = req.files || {};

    if (!name || !Dtext || !BrandId) {
      throw new Error("Name, Description, and Brand are required");
    }

    // Upload Images
    const productImages = {};
    for (let i = 1; i <= 5; i++) {
      const key = `Img${i}`;
      if (files[key]?.[0]) {
        const up = await uploadOnCloudinary(files[key][0].path);
        productImages[key] = up.secure_url || up.url;
      } else {
        throw new Error(`${key} is required`);
      }
    }

    const product = new Product({
      name: norm(name),
      Dtext: norm(Dtext),
      BrandId,
      ...productImages,
      KeyHighlights1: norm(KeyHighlights1),
      KeyHighlights2: norm(KeyHighlights2),
      KeyHighlights3: norm(KeyHighlights3),
      KeyHighlights4: norm(KeyHighlights4),
      KeyHighlights5: norm(KeyHighlights5),
      KeyHighlights6: KeyHighlights6 ? norm(KeyHighlights6) : undefined,
      KeyHighlights7: KeyHighlights7 ? norm(KeyHighlights7) : undefined,
      KeyHighlights8: KeyHighlights8 ? norm(KeyHighlights8) : undefined,
      KeyHighlights9: KeyHighlights9 ? norm(KeyHighlights9) : undefined,
      KeyHighlights10: KeyHighlights10 ? norm(KeyHighlights10) : undefined,
      TechnicalSpecs: [],
      Application: [],
    });

    await product.save({ session });

    // Link to Brand
    await ProductBrand.findByIdAndUpdate(BrandId, { $push: { products: product._id } }, { session });

    await session.commitTransaction();
    return res.status(201).json({ success: true, message: "Product created", data: product });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* ================= READ ALL ================= */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("BrandId")
      .populate("TechnicalSpecs")
      .populate("Application")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= READ SINGLE ================= */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("BrandId")
      .populate("TechnicalSpecs")
      .populate("Application");

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    const product = await Product.findById(id).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = {};
    const textFields = [
      "name", "Dtext", "BrandId", 
      "KeyHighlights1", "KeyHighlights2", "KeyHighlights3", "KeyHighlights4", "KeyHighlights5",
      "KeyHighlights6", "KeyHighlights7", "KeyHighlights8", "KeyHighlights9", "KeyHighlights10",
      "Active"
    ];

    // Update Text Fields
    textFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = norm(req.body[field]);
    });

    // Update Images (Only if new ones provided)
    const files = req.files || {};
    for (let i = 1; i <= 5; i++) {
      const key = `Img${i}`;
      if (files[key]?.[0]) {
        const up = await uploadOnCloudinary(files[key][0].path);
        updates[key] = up.secure_url || up.url;
      }
    }

    // Handle Brand Change (Unlink old, Link new)
    if (updates.BrandId && String(updates.BrandId) !== String(product.BrandId)) {
        await ProductBrand.findByIdAndUpdate(product.BrandId, { $pull: { products: id } }, { session });
        await ProductBrand.findByIdAndUpdate(updates.BrandId, { $push: { products: id } }, { session });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    const product = await Product.findById(id).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found" });
    }

    // Cascading Delete
    await TechSpec.deleteMany({ ProductId: id }).session(session);
    await Application.deleteMany({ ProductId: id }).session(session);

    if (product.BrandId) {
        await ProductBrand.findByIdAndUpdate(product.BrandId, { $pull: { products: id } }, { session });
    }

    await Product.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Product deleted" });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};