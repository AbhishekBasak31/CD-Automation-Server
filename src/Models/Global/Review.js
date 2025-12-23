import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ReviewSchema = new SCHEMA(
  {
    Img: {
      type: String,
      required: true,
    },
    Rating: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Comment: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    ReviewSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeReviewSec",   // ✅ FIXED NAME
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", ReviewSchema);
