import mongoose from "mongoose";
import { HomeBanner } from "../../Models/HomePage/Banner.js"; // Ensure path matches your project structure
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/**
 * HELPER: Upload file to Cloudinary if it exists in request
 */
const uploadFile = async (files, key) => {
  if (files && files[key] && files[key][0]) {
    const upload = await uploadOnCloudinary(files[key][0].path);
    return upload?.secure_url || upload?.url;
  }
  return null;
};

/**
 * CREATE HOME BANNER
 */
export const createHomeBanner = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const files = req.files || {};
    const body = req.body;

    // 1. Define all required text fields from Schema
    const requiredTextFields = [
      "Htext1", "Htext2", "Htext3",
      "Dtext1", "Dtext2", "Dtext3",
      "CardHtext1", "CardHtext2", "CardHtext3",
      "CardDtext1", "CardDtext2", "CardDtext3",
      "SwitcCardNumber1", "SwitcCardNumber2",
      "SwitcCardHtext1", "SwitcCardHtext2",
      "SwitcCardDtext1", "SwitcCardDtext2"
    ];

    // 2. Validate Text Fields
    const missing = requiredTextFields.filter((field) => !norm(body[field]));

    // 3. Validate Required Images
    const requiredImages = ["Img1", "Img2", "Img3", "CardLogo1", "CardLogo2", "CardLogo3"];
    requiredImages.forEach(img => {
        if (!files[img]) missing.push(img);
    });

    if (missing.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // 4. Upload All Images
    const uploads = {};
    for (const imgKey of requiredImages) {
        const url = await uploadFile(files, imgKey);
        if (!url) {
            await session.abortTransaction();
            return res.status(500).json({ success: false, message: `Failed to upload ${imgKey}` });
        }
        uploads[imgKey] = url;
    }

    // 5. Create Document
    const banner = new HomeBanner({
      ...uploads, // Spread uploaded image URLs
      
      // Main Slider Text
      Htext1: norm(body.Htext1), Htext2: norm(body.Htext2), Htext3: norm(body.Htext3),
      Dtext1: norm(body.Dtext1), Dtext2: norm(body.Dtext2), Dtext3: norm(body.Dtext3),

      // Card Section Text
      CardHtext1: norm(body.CardHtext1), CardHtext2: norm(body.CardHtext2), CardHtext3: norm(body.CardHtext3),
      CardDtext1: norm(body.CardDtext1), CardDtext2: norm(body.CardDtext2), CardDtext3: norm(body.CardDtext3),

      // Switch/Stats Card Text
      SwitcCardNumber1: norm(body.SwitcCardNumber1), SwitcCardNumber2: norm(body.SwitcCardNumber2),
      SwitcCardHtext1: norm(body.SwitcCardHtext1), SwitcCardHtext2: norm(body.SwitcCardHtext2),
      SwitcCardDtext1: norm(body.SwitcCardDtext1), SwitcCardDtext2: norm(body.SwitcCardDtext2),
    });

    await banner.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "HomeBanner created successfully.",
      data: banner,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createHomeBanner error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * GET ALL BANNERS
 */
export const getAllHomeBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: banners });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET LATEST BANNER
 */
export const getLatestHomeBanner = async (req, res) => {
  try {
    const latest = await HomeBanner.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ success: false, message: "No HomeBanner found" });
    return res.status(200).json({ success: true, data: latest });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE HOME BANNER
 */
export const updateHomeBanner = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Find the most recent banner to update
    const latest = await HomeBanner.findOne().sort({ createdAt: -1 }).session(session);
    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeBanner found to update." });
    }

    const updates = {};
    const body = req.body;
    const files = req.files || {};

    // 1. Update Text Fields if they exist in request
    const textFields = [
      "Htext1", "Htext2", "Htext3",
      "Dtext1", "Dtext2", "Dtext3",
      "CardHtext1", "CardHtext2", "CardHtext3",
      "CardDtext1", "CardDtext2", "CardDtext3",
      "SwitcCardNumber1", "SwitcCardNumber2",
      "SwitcCardHtext1", "SwitcCardHtext2",
      "SwitcCardDtext1", "SwitcCardDtext2"
    ];

    textFields.forEach((field) => {
      if (body[field] !== undefined) updates[field] = norm(body[field]);
    });

    // 2. Update Images only if new files are uploaded
    const imageFields = ["Img1", "Img2", "Img3", "CardLogo1", "CardLogo2", "CardLogo3"];
    
    for (const field of imageFields) {
      const url = await uploadFile(files, field);
      if (url) updates[field] = url;
    }

    const updated = await HomeBanner.findByIdAndUpdate(latest._id, updates, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "HomeBanner updated successfully.",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updateHomeBanner error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * DELETE HOME BANNER
 */
export const deleteHomeBanner = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const latest = await HomeBanner.findOne().sort({ createdAt: -1 }).session(session);
    if (!latest) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "No HomeBanner found to delete." });
    }
    await HomeBanner.findByIdAndDelete(latest._id, { session });
    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "HomeBanner deleted successfully." });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};