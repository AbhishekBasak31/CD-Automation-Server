import mongoose from "mongoose";

const jobapplicationSchema = new mongoose.Schema({
  // FIX 1: The controller sends 'jobId', so this must be 'jobId'
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Make sure this matches your Job model name
    required: true
  },

  // Personal Info
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // Optional Links
  linkedinUrl: { type: String },
  portfolioUrl: { type: String },
  coverLetter: { type: String },

  // HR Data
  experienceYears: { type: Number },
  currentCtc: { type: String },
  expectedCtc: { type: String },
  noticePeriod: { type: String },
  
  // FIX 2: The controller sends 'resumeUrl', so this must be 'resumeUrl' (NOT 'img')
  resumeUrl: {
    type: String,
    required: true 
  },

  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Interviewing', 'Rejected', 'Hired'],
    default: 'Pending'
  }
}, { timestamps: true });

export const jobapplication = mongoose.model("jobapplication", jobapplicationSchema);