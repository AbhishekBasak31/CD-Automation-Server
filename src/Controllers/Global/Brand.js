import mongoose from "mongoose";
import { ProductBrand } from "../../Models/Global/Brand.js";
// import  Product  from "../../Models/Global/Product.js"; 
import uploadOnCloudinary from "../../Utils/Clodinary.js";


const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE Brand
   ========================================================= */
export const createProductBrand = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, Dtext } = req.body;
    const file = req.file;

    const missing = [];
    if (!name) missing.push("name");
    if (!Dtext) missing.push("Dtext");
    if (!file) missing.push("Img");

    if (missing.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missing.join(", ")}`,
      });
    }

    // Upload Image
    const upload = await uploadOnCloudinary(file.path);
    if (!upload) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    const brand = new ProductBrand({
      name: norm(name),
      Dtext: norm(Dtext),
      Img: upload.secure_url || upload.url,
      products: [], // Starts empty
    });

    await brand.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createProductBrand error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   GET ALL Brands (with Products populated)
   ========================================================= */
export const getAllProductBrands = async (req, res) => {
  try {
    const list = await ProductBrand.find()
      .sort({ createdAt: -1 })
      .populate("products"); // Assuming you want to see linked products

    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const getProductBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const brand = await ProductBrand.findById(id).populate("products");

    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    return res.status(200).json({ success: true, data: brand });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
/* =========================================================
   UPDATE Brand
   ========================================================= */
export const updateProductBrand = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid ID" });
    }

    const updates = {};
    if (req.body.name) updates.name = norm(req.body.name);
    if (req.body.Dtext) updates.Dtext = norm(req.body.Dtext);

    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      if (upload) updates.Img = upload.secure_url || upload.url;
    }

    const updated = await ProductBrand.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, session }
    );

    if (!updated) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Brand not found" });
    }

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
   DELETE Brand
   ========================================================= */
export const deleteProductBrand = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid ID" });
    }

    // 1. Find the brand first (to get the list of products)
    const brand = await ProductBrand.findById(id).session(session);

    if (!brand) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Brand not found" });
    }

    // 2. Delete all associated products
    // This checks if there are products linked and deletes them from the Product collection
    if (brand.products && brand.products.length > 0) {
        await Product.deleteMany({ _id: { $in: brand.products } }).session(session);
    }

    // 3. Delete the brand itself
    await ProductBrand.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    return res.status(200).json({ 
        success: true, 
        message: "Brand and associated products deleted successfully" 
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deleteProductBrand error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};