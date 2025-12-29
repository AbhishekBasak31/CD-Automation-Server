import { Director } from "../../Models/Global/Director.js"; 
import { AboutPage } from "../../Models/AboutPage/AboutPage.js";
import  uploadOnCloudinary  from "../../Utils/Clodinary.js";

// ============================
// 1. Create Director
// ============================
export const createDirector = async (req, res) => {
  try {
    // 1. Explicitly Extract Fields
    const { name, desig, Dtext, LinkdinId } = req.body;

    // 2. Handle Image
    let DirectorImg = "";
    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      DirectorImg = uploadRes?.url || "";
    } else {
      return res.status(400).json({ error: "Director image is required" });
    }

    // 3. Save Director
    const newDirector = new Director({
      name,
      desig,
      Dtext,
      LinkdinId,
      DirectorImg
    });

    const savedDirector = await newDirector.save();

    // 4. Push to AboutPage
    const aboutPage = await AboutPage.findOne();
    if (aboutPage) {
      aboutPage.Directors.push(savedDirector._id);
      await aboutPage.save();
    }

    res.status(201).json({
      success: true,
      message: "Director created and added to About Page",
      data: savedDirector,
    });

  } catch (err) {
    console.error("Director Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 2. Get All Directors
// ============================
export const getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    res.status(200).json({ success: true, count: directors.length, data: directors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 3. Update Director
// ============================
export const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Explicitly Extract Fields
    const { name, desig, Dtext, LinkdinId } = req.body;
    
    const updates = { name, desig, Dtext, LinkdinId };

    // 2. Handle Image
    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      if (uploadRes?.url) {
        updates.DirectorImg = uploadRes.url;
      }
    }

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const updatedDirector = await Director.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedDirector) return res.status(404).json({ error: "Director not found" });

    res.status(200).json({ success: true, message: "Director updated", data: updatedDirector });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 4. Delete Director
// ============================
export const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDirector = await Director.findByIdAndDelete(id);
    if (!deletedDirector) return res.status(404).json({ error: "Director not found" });

    // Remove reference from AboutPage
    await AboutPage.updateMany({}, { $pull: { Directors: id } });

    res.status(200).json({ success: true, message: "Director deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};