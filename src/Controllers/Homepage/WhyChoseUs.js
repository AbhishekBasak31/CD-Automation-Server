import { HomeWhychooseUs } from "../../Models/HomePage/WhyChooseUs.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";

/* ================= GET (Singleton) ================= */
export const getWhyChooseUs = async (req, res) => {
  try {
    // Always fetch the first available document
    const data = await HomeWhychooseUs.findOne();
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= CREATE (Only if empty) ================= */
export const createWhyChooseUs = async (req, res) => {
  try {
    // 1. Check if section already exists
    const existing = await HomeWhychooseUs.findOne();
    if (existing) {
      return res.status(400).json({ message: "Section already exists. Use Update method instead." });
    }

    // 2. Destructure body to ensure all fields are caught
    const {
      Htext, Dtext, BPoint1, BPoint2,
      Card1Counter, Card1Text,
      Card2Counter, Card2Text,
      Card3Counter, Card3Text,
      Card4Counter, Card4Text
    } = req.body;

    // 3. Handle Image Upload
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Background Image (BgImg) is required" });

    const up = await uploadOnCloudinary(file.path);
    if (!up) return res.status(500).json({ message: "Image upload failed" });

    // 4. Create Document
    const newData = new HomeWhychooseUs({
      Htext, Dtext, BPoint1, BPoint2,
      BgImg: up.secure_url || up.url,
      Card1Counter, Card1Text,
      Card2Counter, Card2Text,
      Card3Counter, Card3Text,
      Card4Counter, Card4Text
    });

    await newData.save();
    return res.status(201).json({ success: true, message: "Created successfully", data: newData });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE (No ID Required) ================= */
export const updateWhyChooseUs = async (req, res) => {
  try {
    // 1. Find the existing singleton document
    const existing = await HomeWhychooseUs.findOne();
    if (!existing) return res.status(404).json({ message: "No data found to update. Please Create first." });

    // 2. Prepare Updates
    const updates = { ...req.body };
    const file = req.file;

    // 3. Handle Image Update (if new file provided)
    if (file) {
      const up = await uploadOnCloudinary(file.path);
      if (up) updates.BgImg = up.secure_url || up.url;
    }

    // 4. Update the specific document found
    const updatedDoc = await HomeWhychooseUs.findByIdAndUpdate(
      existing._id, 
      updates, 
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Updated successfully", data: updatedDoc });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE (No ID Required) ================= */
export const deleteWhyChooseUs = async (req, res) => {
  try {
    // Deletes the first document found
    const deleted = await HomeWhychooseUs.findOneAndDelete();
    
    if (!deleted) return res.status(404).json({ message: "Nothing to delete" });

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};