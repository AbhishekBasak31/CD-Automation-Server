import { jobapplication } from "../../Models/Global/Jobapplicationform.js";
import uploadOnSupabase, { deleteFromSupabase } from "../../Utils/Superbase.js"; // Import new utility



export const applyForJob = async (req, res) => {
  try {
    const resumeLocalPath = req.file?.path;
    const originalName = req.file?.originalname;
    const mimeType = req.file?.mimetype;

    if (!resumeLocalPath) {
      return res.status(400).json({ 
        success: false, 
        message: "Resume file is required" 
      });
    }

    // --- UPLOAD TO SUPABASE ---
    // Pass local path, mime type (application/pdf), and original name
    const resumeUrl = await uploadOnSupabase(resumeLocalPath, mimeType, originalName);

    if (!resumeUrl) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to upload resume to cloud storage" 
      });
    }
    // --------------------------

    const { 
      jobId, fullName, email, phone, linkedinUrl, 
      portfolioUrl, coverLetter, experienceYears,
      currentCtc, expectedCtc, noticePeriod
    } = req.body;

    // Check for duplicates
    const existingApplication = await jobapplication.findOne({ jobId, email });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this position with this email."
      });
    }

    // Create Database Entry
    const application = await jobapplication.create({
      jobId, fullName, email, phone, linkedinUrl, 
      portfolioUrl, coverLetter, experienceYears,
      currentCtc, expectedCtc, noticePeriod,
      resumeUrl: resumeUrl // This is now a direct link (e.g., supabase.co/.../mycv.pdf)
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application
    });

  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate Status
    const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
      });
    }

    // Find and Update
    const application = await jobapplication.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: application
    });

  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// --- 4. ADMIN: DELETE APPLICATION ---
// Usage: DELETE /api/v1/application/:id
// --- 4. ADMIN: DELETE APPLICATION ---
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the application first
    const application = await jobapplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // 2. Delete the Resume from Supabase Storage
    if (application.resumeUrl) {
        await deleteFromSupabase(application.resumeUrl);
    }

    // 3. Delete from MongoDB
    await jobapplication.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application and Resume deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
export const getAllApplications = async (req, res) => {
  try {
    const applications = await jobapplication.find({}) // Empty filter = Find All
      .populate("jobId") 
      .sort({ createdAt: -1 }); // Newest applications first

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error("Error fetching all applications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
      error: error.message
    });
  }
};

export const getApplicationbyID = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await jobapplication.findById(id)
      .populate("jobId") 

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error("Error fetching application details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching details",
      error: error.message
    });
  }
};



// export const applyForJob = async (req, res) => {
//   try {
//     // 1. Check if the resume file exists in the request
//     // Multer attaches the file to req.file
//     const resumeLocalPath = req.file?.path;

//     if (!resumeLocalPath) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Resume file is required" 
//       });
//     }

//     // 2. Upload the file to Cloudinary
//     // Your utility handles the upload and deletes the local file automatically
//     const resumeUploadResponse = await uploadOnCloudinary(resumeLocalPath);

//     if (!resumeUploadResponse) {
//       return res.status(500).json({ 
//         success: false, 
//         message: "Failed to upload resume to cloud storage" 
//       });
//     }

//     // 3. Extract text fields from req.body
//     const { 
//       jobId, 
//       fullName, 
//       email, 
//       phone, 
//       linkedinUrl, 
//       portfolioUrl, 
//       coverLetter,
//       experienceYears,
//       currentCtc,
//       expectedCtc,
//       noticePeriod
//     } = req.body;

//     // 4. Check for duplicate application (Optional logic)
//     const existingApplication = await jobapplication.findOne({ jobId, email });
//     if (existingApplication) {
//       return res.status(409).json({
//         success: false,
//         message: "You have already applied for this position with this email."
//       });
//     }

//     // 5. Create the Database Entry
//     const application = await jobapplication.create({
//       jobId,
//       fullName,
//       email,
//       phone,
//       linkedinUrl,
//       portfolioUrl,
//       coverLetter,
//       experienceYears,
//       currentCtc,
//       expectedCtc,
//       noticePeriod,
//       // Store the Cloudinary URL in the database
//       resumeUrl: resumeUploadResponse.secure_url 
//     });

//     // 6. Send Success Response
//     return res.status(201).json({
//       success: true,
//       message: "Application submitted successfully",
//       data: application
//     });

//   } catch (error) {
//     console.error("Error submitting application:", error);
    
//     // Note: If an error occurs here (e.g. MongoDB validation error), 
//     // your uploadOnCloudinary utility has already deleted the local file, 
//     // so we don't need to clean it up again here.
    
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };
