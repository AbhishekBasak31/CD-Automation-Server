import mongoose from "mongoose";
import uploadOnCloudinary from "../../Utils/Clodinary.js";
import { Review } from "../../Models/Global/Review.js"; 
import { HomeReviewSec } from "../../Models/HomePage/ReviewSec.js";

const norm = (v) => (typeof v === "string" ? v.trim() : v);

/* =========================================================
   CREATE Review (Includes Client Image)
   ========================================================= */
export const createReview = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { Rating, Name, Comment, location, reviewSectionId } = req.body;
    const file = req.file; 

    const missing = [];
    if (!file) missing.push("Img");
    if (!Rating) missing.push("Rating");
    if (!Name) missing.push("Name");
    if (!Comment) missing.push("Comment");
    if (!reviewSectionId) missing.push("reviewSectionId");

    if (missing.length) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Missing: ${missing.join(", ")}` });
    }

    // Verify Parent Section Exists
    const section = await HomeReviewSec.findById(reviewSectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "ReviewSection not found" });
    }

    // Upload Client Image
    const up = await uploadOnCloudinary(file.path);
    if (!up) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    const reviewDoc = new Review({
      Img: up.secure_url || up.url,
      Rating: norm(Rating),
      Name: norm(Name),
      Comment: norm(Comment),
      location: norm(location),
      ReviewSection: section._id,
    });

    await reviewDoc.save({ session });

    // Link to Section
    await HomeReviewSec.findByIdAndUpdate(
      section._id,
      { $addToSet: { Reviews: reviewDoc._id } },
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json({ success: true, message: "Review created", data: reviewDoc });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
/**
 * Get Reviews
 * GET / -> list
 * GET /latest -> latest
 * GET /:id -> by id
 */
export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(String(id))) return res.status(400).json({ success: false, message: "Invalid ID" });
      const doc = await Review.findById(id).populate("ReviewSection");
      if (!doc) return res.status(404).json({ success: false, message: "Review not found" });
      return res.status(200).json({ success: true, data: doc });
    }

    if (req.path && req.path.endsWith("/latest")) {
      const latest = await Review.findOne({}).sort({ createdAt: -1 }).populate("ReviewSection");
      if (!latest) return res.status(404).json({ success: false, message: "No Review found" });
      return res.status(200).json({ success: true, data: latest });
    }

    const items = await Review.find({}).sort({ createdAt: -1 }).populate("ReviewSection");
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error("getReviews error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};



/* =========================================================
   UPDATE Review
   ========================================================= */
export const updateReview = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid ID" });
    }

    const updates = {};
    ["Rating", "Name", "Comment", "location", "active"].forEach(f => {
        if(req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Handle Image Replacement
    if (req.file) {
        const up = await uploadOnCloudinary(req.file.path);
        if(up) updates.Img = up.secure_url || up.url;
    }

    const updated = await Review.findByIdAndUpdate(id, updates, { new: true, session });
    
    await session.commitTransaction();
    return res.status(200).json({ success: true, data: updated });

  } catch(err) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(500).json({ message: err.message });
  } finally {
      session.endSession();
  }
};

/* =========================================================
   DELETE Review
   ========================================================= */
export const deleteReview = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;

    const deleted = await Review.findByIdAndDelete(id, { session });
    
    if(deleted) {
        // Remove reference from Section
        await HomeReviewSec.updateMany(
            { Reviews: id },
            { $pull: { Reviews: id } },
            { session }
        );
    }

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Deleted" });

  } catch(err) {
      if (session.inTransaction()) await session.abortTransaction();
      return res.status(500).json({ message: err.message });
  } finally {
      session.endSession();
  }
};