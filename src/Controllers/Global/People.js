import mongoose from "mongoose";
import { People } from "../../Models/Global/People.js";
import { HomeOurteam } from "../../Models/HomePage/OurTeam.js";
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE People + PUSH into HomeOurteam.Ourteam
   ========================================================= */
export const createPeople = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const file = req.file;
    const { Htext, Desig, Quote } = req.body;

    const missing = [];
    if (!file) missing.push("Img");
    if (!Htext) missing.push("Htext");
    if (!Desig) missing.push("Desig");
    if (!Quote) missing.push("Quote");

    if (missing.length)
      return res.status(400).json({
        success: false,
        message: `Missing: ${missing.join(", ")}`,
      });

    const upload = await uploadOnCloudinary(file.path);

    const person = new People({
      Img: upload.secure_url || upload.url,
      Htext: norm(Htext),
      Desig: norm(Desig),
      Quote: norm(Quote),
    });

    await person.save({ session });

    // Push into latest HomeOurteam
    const ourteam = await HomeOurteam.findOne().sort({ createdAt: -1 }).session(session);
    if (ourteam) {
      ourteam.Ourteam.push(person._id);
      await ourteam.save({ session });
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "People created & added to Ourteam successfully",
      data: person,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createPeople error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


/* =========================================================
   GET ALL People
   ========================================================= */
export const getAllPeople = async (req, res) => {
  try {
    const list = await People.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: list,
    });

  } catch (err) {
    console.error("getAllPeople error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================================================
   UPDATE People (Image optional)
   ========================================================= */
export const updatePeople = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const id=req.params
    const {  Htext, Desig, Quote } = req.body;


    if (!id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "People ID (id) is required",
      });
    }

    const person = await People.findById(id).session(session);

    if (!person) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "People not found",
      });
    }

    const updates = {};

    if (Htext !== undefined) updates.Htext = norm(Htext);
    if (Desig !== undefined) updates.Desig = norm(Desig);
    if (Quote !== undefined) updates.Quote = norm(Quote);

    // Optional image update
    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      updates.Img = upload.secure_url || upload.url;
    }

    const updated = await People.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "People updated successfully",
      data: updated,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("updatePeople error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


/* =========================================================
   DELETE People + REMOVE from HomeOurteam.Ourteam
   ========================================================= */
export const deletePeople = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    if (!id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "People ID (id) is required",
      });
    }

    const person = await People.findById(id).session(session);

    if (!person) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "People not found",
      });
    }

    // Remove from HomeOurteam.Ourteam[] array
    await HomeOurteam.updateMany(
      { Ourteam: id },
      { $pull: { Ourteam: id } },
      { session }
    );

    const deleted = await People.findByIdAndDelete(id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "People deleted & removed from Ourteam successfully",
      data: deleted,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("deletePeople error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
