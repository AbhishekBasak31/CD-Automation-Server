// src/Controller/Global/ContactDetails.js
import { ContactDetails } from "../../Models/Global/ContactDetails.js"; 

const norm = (v) => (typeof v === "string" ? v.trim() : v);

export const createContactDetails = async (req, res) => {
  try {
    // Added Htext and Dtext to destructuring
    const { Htext, Dtext, address, phone, email, whour, map } = req.body;

    // Basic validation - Added checks for Htext and Dtext
    if (
      !Htext || !String(Htext).trim() ||
      !Dtext || !String(Dtext).trim() ||
      !address || !String(address).trim() ||
      !phone || !String(phone).trim() ||
      !email || !String(email).trim() ||
      !whour || !String(whour).trim() ||
      !map || !String(map).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: Htext, Dtext, address, phone, email, whour, map.",
      });
    }

    const contact = new ContactDetails({
      Htext: String(Htext).trim(),
      Dtext: String(Dtext).trim(),
      address: String(address).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      whour: String(whour).trim(),
      map: String(map).trim(),
    });

    await contact.save();

    return res.status(201).json({
      success: true,
      message: "Contact details created successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("createContactDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating contact details.",
      error: error.message,
    });
  }
};

export const getAllContactDetails = async (req, res) => {
  try {
    const contacts = await ContactDetails.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("getAllContactDetails error:", error);
    return res.status(500).json({ success: false, message: "Internal server error while fetching contact details.", error: error.message });
  }
};

export const updateContactDetails = async (req, res) => {
  try {
    // Added Htext and Dtext to destructuring
    const { id, Htext, Dtext, address, phone, email, whour, map } = req.body;

    const updates = {};

    // Added Update logic for Htext
    if (Htext !== undefined) {
      if (!String(Htext).trim()) return res.status(400).json({ success: false, message: "If provided, Htext must be a non-empty string." });
      updates.Htext = String(Htext).trim();
    }

    // Added Update logic for Dtext
    if (Dtext !== undefined) {
      if (!String(Dtext).trim()) return res.status(400).json({ success: false, message: "If provided, Dtext must be a non-empty string." });
      updates.Dtext = String(Dtext).trim();
    }

    if (address !== undefined) {
      if (!String(address).trim()) return res.status(400).json({ success: false, message: "If provided, address must be a non-empty string." });
      updates.address = String(address).trim();
    }
    if (phone !== undefined) {
      if (!String(phone).trim()) return res.status(400).json({ success: false, message: "If provided, phone must be a non-empty string." });
      updates.phone = String(phone).trim();
    }
    if (email !== undefined) {
      if (!String(email).trim()) return res.status(400).json({ success: false, message: "If provided, email must be a non-empty string." });
      updates.email = String(email).trim();
    }
    if (whour !== undefined) {
      if (!String(whour).trim()) return res.status(400).json({ success: false, message: "If provided, whour must be a non-empty string." });
      updates.whour = String(whour).trim();
    }
    if (map !== undefined) {
      if (!String(map).trim()) return res.status(400).json({ success: false, message: "If provided, map must be a non-empty string." });
      updates.map = String(map).trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided to update." });
    }

    let contact;
    if (id) {
      contact = await ContactDetails.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    } else {
      contact = await ContactDetails.findOneAndUpdate({}, { $set: updates }, { sort: { createdAt: -1 }, new: true, runValidators: true });
    }

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact details not found to update." });
    }

    return res.status(200).json({ success: true, message: "Contact details updated successfully.", data: contact });
  } catch (error) {
    console.error("updateContactDetails error:", error);
    return res.status(500).json({ success: false, message: "Internal server error while updating contact details.", error: error.message });
  }
};

export const deleteContactDetails = async (req, res) => {
  try {
    const { id } = req.body;

    let deleted;
    if (id) {
      deleted = await ContactDetails.findByIdAndDelete(id);
    } else {
      deleted = await ContactDetails.findOneAndDelete({}, { sort: { createdAt: -1 } });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Contact details not found to delete." });
    }

    return res.status(200).json({ success: true, message: "Contact details deleted successfully.", data: deleted });
  } catch (error) {
    console.error("deleteContactDetails error:", error);
    return res.status(500).json({ success: false, message: "Internal server error while deleting contact details.", error: error.message });
  }
};