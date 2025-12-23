import mongoose from "mongoose";
import { Client } from "../../Models/Global/Client.js"; // Adjust path
import uploadOnCloudinary from "../../Utils/Clodinary.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE Client
   ========================================================= */
export const createClient = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, Dtext } = req.body;
    const file = req.file;

    const missing = [];
    if (!name) missing.push("name");
    if (!Dtext) missing.push("Dtext");
    if (!file) missing.push("img");

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

    const client = new Client({
      name: norm(name),
      Dtext: norm(Dtext),
      img: upload.secure_url || upload.url,
    });

    await client.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("createClient error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   GET ALL Clients
   ========================================================= */
export const getAllClients = async (req, res) => {
  try {
    const list = await Client.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   UPDATE Client
   ========================================================= */
export const updateClient = async (req, res) => {
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
      if (upload) updates.img = upload.secure_url || upload.url;
    }

    const updated = await Client.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, session }
    );

    if (!updated) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Client not found" });
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
   DELETE Client
   ========================================================= */
export const deleteClient = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid ID" });
    }

    const deleted = await Client.findByIdAndDelete(id, { session });

    if (!deleted) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Client not found" });
    }

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Deleted successfully", data: deleted });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};