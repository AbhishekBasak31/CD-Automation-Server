import { CareerPage } from "../../Models/CareeerPage/CareerPage.js"; // Adjust path
import uploadOnCloudinary  from "../../Utils/Clodinary.js";

// ============================
// 1. Create Career Page
// ============================
export const createCareerPage = async (req, res) => {
  try {
    // 1. Check if page exists
    const existingPage = await CareerPage.findOne();
    if (existingPage) {
      return res.status(400).json({ error: "Career Page already exists. Please update it instead." });
    }

    // 2. Explicitly Extract Fields
    const {
      WhyJoinUsHtext,
      WhyJoinUsDtext,
      WhyJoinUsCardHtext1,
      WhyJoinUsCardHtext2,
      WhyJoinUsCardHtext3,
      WhyJoinUsCardDtext1,
      WhyJoinUsCardDtext2,
      WhyJoinUsCardDtext3
    } = req.body;

    // 3. Handle Images Explicitly
    let Icon1Url = "";
    if (req.files && req.files.WhyJoinUsCardIcon1) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon1[0].path);
      Icon1Url = uploadRes?.url || "";
    }

    let Icon2Url = "";
    if (req.files && req.files.WhyJoinUsCardIcon2) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon2[0].path);
      Icon2Url = uploadRes?.url || "";
    }

    let Icon3Url = "";
    if (req.files && req.files.WhyJoinUsCardIcon3) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon3[0].path);
      Icon3Url = uploadRes?.url || "";
    }

    // 4. Save New Page
    const newPage = new CareerPage({
      // Text Fields
      WhyJoinUsHtext,
      WhyJoinUsDtext,
      WhyJoinUsCardHtext1,
      WhyJoinUsCardHtext2,
      WhyJoinUsCardHtext3,
      WhyJoinUsCardDtext1,
      WhyJoinUsCardDtext2,
      WhyJoinUsCardDtext3,

      // Image Fields
      WhyJoinUsCardIcon1: Icon1Url,
      WhyJoinUsCardIcon2: Icon2Url,
      WhyJoinUsCardIcon3: Icon3Url,
    });

    await newPage.save();

    res.status(201).json({
      success: true,
      message: "Career Page created successfully",
      data: newPage,
    });

  } catch (err) {
    console.error("Create CareerPage Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 2. Get Career Page
// ============================
export const getCareerPage = async (req, res) => {
  try {
    const page = await CareerPage.findOne();
    if (!page) return res.status(404).json({ error: "Career Page not found" });

    res.status(200).json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 3. Update Career Page (No ID Required)
// ============================
export const updateCareerPage = async (req, res) => {
  try {
    const page = await CareerPage.findOne();
    if (!page) return res.status(404).json({ error: "Career Page not found. Please create one first." });

    // 1. Explicitly Extract Fields
    const {
      WhyJoinUsHtext,
      WhyJoinUsDtext,
      WhyJoinUsCardHtext1,
      WhyJoinUsCardHtext2,
      WhyJoinUsCardHtext3,
      WhyJoinUsCardDtext1,
      WhyJoinUsCardDtext2,
      WhyJoinUsCardDtext3
    } = req.body;

    const updates = {
      WhyJoinUsHtext,
      WhyJoinUsDtext,
      WhyJoinUsCardHtext1,
      WhyJoinUsCardHtext2,
      WhyJoinUsCardHtext3,
      WhyJoinUsCardDtext1,
      WhyJoinUsCardDtext2,
      WhyJoinUsCardDtext3
    };

    // 2. Handle Images (Only update if new file provided)
    if (req.files && req.files.WhyJoinUsCardIcon1) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon1[0].path);
      if (uploadRes?.url) updates.WhyJoinUsCardIcon1 = uploadRes.url;
    }

    if (req.files && req.files.WhyJoinUsCardIcon2) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon2[0].path);
      if (uploadRes?.url) updates.WhyJoinUsCardIcon2 = uploadRes.url;
    }

    if (req.files && req.files.WhyJoinUsCardIcon3) {
      const uploadRes = await uploadOnCloudinary(req.files.WhyJoinUsCardIcon3[0].path);
      if (uploadRes?.url) updates.WhyJoinUsCardIcon3 = uploadRes.url;
    }

    // 3. Remove undefined keys
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    // 4. Update the single document
    const updatedPage = await CareerPage.findOneAndUpdate({}, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Career Page updated successfully",
      data: updatedPage,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};