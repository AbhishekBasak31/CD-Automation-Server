import { AboutBanner } from "../../Models/AboutPage/Banner.js"; // Adjust path to your model
import uploadOnCloudinary from "../../Utils/Clodinary.js";

/* ================= GET (Singleton) ================= */
export const getAboutBanner = async (req, res) => {
  try {
    // Always fetch the latest/first document
    const data = await AboutBanner.findOne();
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

/* ================= CREATE (Only if empty) ================= */
export const createAboutBanner = async (req, res) => {
  try {
    // 1. Check if banner already exists
    const existing = await AboutBanner.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Banner already exists. Use Update instead." });
    }

    // 2. Validate Inputs
    const { Htext, Dtext } = req.body;
    const file = req.file;

    if (!Htext || !Dtext || !file) {
      return res.status(400).json({ success: false, message: "Htext, Dtext, and Image are required." });
    }

    // 3. Upload Image
    const upload = await uploadOnCloudinary(file.path);
    if (!upload) {
      return res.status(500).json({ success: false, message: "Image upload failed." });
    }

    // 4. Save
    const newBanner = new AboutBanner({
      Htext,
      Dtext,
      Img: upload.secure_url || upload.url,
    });

    await newBanner.save();
    return res.status(201).json({ success: true, message: "About Banner created successfully", data: newBanner });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

/* ================= UPDATE (No ID needed) ================= */
export const updateAboutBanner = async (req, res) => {
  try {
    // 1. Find the existing document
    const existing = await AboutBanner.findOne();
    if (!existing) {
      return res.status(404).json({ success: false, message: "No banner found to update." });
    }

    // 2. Prepare Updates
    const updates = {};
    if (req.body.Htext) updates.Htext = req.body.Htext;
    if (req.body.Dtext) updates.Dtext = req.body.Dtext;

    // 3. Handle Image Replacement
    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      if (upload) {
        updates.Img = upload.secure_url || upload.url;
      }
    }

    // 4. Update
    const updatedBanner = await AboutBanner.findByIdAndUpdate(
      existing._id,
      { $set: updates },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "About Banner updated", data: updatedBanner });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

/* ================= DELETE (No ID needed) ================= */
export const deleteAboutBanner = async (req, res) => {
  try {
    const deleted = await AboutBanner.findOneAndDelete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "No banner found to delete." });
    }
    return res.status(200).json({ success: true, message: "About Banner deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};