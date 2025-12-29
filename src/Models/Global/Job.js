import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const JobSchema = new SCHEMA(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // For URL friendly links (e.g., /careers/senior-engineer)
    slug: {
      type: String,
      lowercase: true,
      unique: true, 
    },
    department: {
      type: String,
      required: true, // e.g., "Engineering", "Sales"
    },
    location: {
      type: String,
      required: true, // e.g., "Kolkata, HQ"
    },
    type: {
      type: String,
      required: true, 
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time"
    },
    description: {
      type: String,
      required: true, // Short summary or full description
    },
    // Detailed bullet points (Optional but good for details page)
    requirements: [{
      type: String
    }],
    responsibilities: [{
      type: String
    }],
    salary: {
      type: String, // e.g., "10LPA - 15LPA" or "Competitive"
      default: "Not Disclosed"
    },
    experience: {
      type: String, // e.g., "5+ Years"
    },
    tags: [{
      type: String // e.g., ["PLC", "SCADA", "Sales"]
    }],
    isActive: {
      type: Boolean,
      default: true, // Set to false to hide from frontend without deleting
    },
  },
  { timestamps: true }
);

// Middleware to auto-generate slug before saving
JobSchema.pre("save", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

export const Job = mongoose.model("Job", JobSchema);