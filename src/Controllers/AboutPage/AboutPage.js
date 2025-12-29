import { AboutPage } from "../../Models/AboutPage/AboutPage.js";
import  uploadOnCloudinary  from "../../Utils/Clodinary.js";

// ============================
// 1. Create About Page
// ============================
export const createAboutPage = async (req, res) => {
  try {
    // 1. Check if page exists
    const existingPage = await AboutPage.findOne();
    if (existingPage) {
      return res.status(400).json({ error: "About Page already exists. Please update it instead." });
    }

    // 2. Explicitly Extract Text Fields
    const {
      BannerHtext, BannerDtext,
      WhoweareTag, WhoweareHtext, WhoweareDtext,
      WhoweareBulletPoint1, WhoweareBulletPoint2, WhoweareBulletPoint3, WhoweareBulletPoint4,
      WhoweareCounter, WhoweareCounterText,
      Counter1, Counter2, Counter3, Counter4,
      CounterText1, CounterText2, CounterText3, CounterText4,
      OurmissionHText, OurmissionText,
      OurvisionHText, OurvisionText,
      WhychooseusTag, WhychooseusHtext,
      WhychooseusCardHtext1, WhychooseusCardDtext1,
      WhychooseusCardHtext2, WhychooseusCardDtext2,
      WhychooseusCardHtext3, WhychooseusCardDtext3,
      ContactHtext, ContactDtext
    } = req.body;

    // 3. Explicitly Handle Each Single Image Upload
    // We check req.files['FieldName'] directly for every single image field.
    
    let BannerImgUrl = "";
    if (req.files && req.files.BannerImg) {
        const uploadRes = await uploadOnCloudinary(req.files.BannerImg[0].path);
        BannerImgUrl = uploadRes?.url || "";
    }

    let WhoweareImgUrl = "";
    if (req.files && req.files.WhoweareImg) {
        const uploadRes = await uploadOnCloudinary(req.files.WhoweareImg[0].path);
        WhoweareImgUrl = uploadRes?.url || "";
    }

    let WhychooseusCardIcon1Url = "";
    if (req.files && req.files.WhychooseusCardIcon1) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon1[0].path);
        WhychooseusCardIcon1Url = uploadRes?.url || "";
    }

    let WhychooseusCardIcon2Url = "";
    if (req.files && req.files.WhychooseusCardIcon2) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon2[0].path);
        WhychooseusCardIcon2Url = uploadRes?.url || "";
    }

    let WhychooseusCardIcon3Url = "";
    if (req.files && req.files.WhychooseusCardIcon3) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon3[0].path);
        WhychooseusCardIcon3Url = uploadRes?.url || "";
    }

    // 4. Save New Page
    const newPage = new AboutPage({
      // Images (Explicitly assigned)
      BannerImg: BannerImgUrl,
      WhoweareImg: WhoweareImgUrl,
      WhychooseusCardIcon1: WhychooseusCardIcon1Url,
      WhychooseusCardIcon2: WhychooseusCardIcon2Url,
      WhychooseusCardIcon3: WhychooseusCardIcon3Url,
      
      // Text Fields
      BannerHtext, BannerDtext,
      WhoweareTag, WhoweareHtext, WhoweareDtext,
      WhoweareBulletPoint1, WhoweareBulletPoint2, WhoweareBulletPoint3, WhoweareBulletPoint4,
      WhoweareCounter, WhoweareCounterText,
      Counter1, Counter2, Counter3, Counter4,
      CounterText1, CounterText2, CounterText3, CounterText4,
      OurmissionHText, OurmissionText,
      OurvisionHText, OurvisionText,
      WhychooseusTag, WhychooseusHtext,
      WhychooseusCardHtext1, WhychooseusCardDtext1,
      WhychooseusCardHtext2, WhychooseusCardDtext2,
      WhychooseusCardHtext3, WhychooseusCardDtext3,
      ContactHtext, ContactDtext,

      Directors: [] 
    });

    await newPage.save();

    res.status(201).json({
      success: true,
      message: "About Page created successfully",
      data: newPage,
    });

  } catch (err) {
    console.error("Create AboutPage Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 2. Get About Page
// ============================
export const getAboutPage = async (req, res) => {
  try {
    const page = await AboutPage.findOne().populate("Directors");
    if (!page) return res.status(404).json({ error: "About Page not found" });

    res.status(200).json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 3. Update About Page
// ============================
export const updateAboutPage = async (req, res) => {
  try {
    // Find the single existing page
    const page = await AboutPage.findOne();

    if (!page) return res.status(404).json({ error: "About Page not found. Please create one first." });

    // Explicitly Extract Fields
    const {
      BannerHtext, BannerDtext,
      WhoweareTag, WhoweareHtext, WhoweareDtext,
      WhoweareBulletPoint1, WhoweareBulletPoint2, WhoweareBulletPoint3, WhoweareBulletPoint4,
      WhoweareCounter, WhoweareCounterText,
      Counter1, Counter2, Counter3, Counter4,
      CounterText1, CounterText2, CounterText3, CounterText4,
      OurmissionHText, OurmissionText,
      OurvisionHText, OurvisionText,
      WhychooseusTag, WhychooseusHtext,
      WhychooseusCardHtext1, WhychooseusCardDtext1,
      WhychooseusCardHtext2, WhychooseusCardDtext2,
      WhychooseusCardHtext3, WhychooseusCardDtext3,
      ContactHtext, ContactDtext
    } = req.body;

    const updates = {
      BannerHtext, BannerDtext,
      WhoweareTag, WhoweareHtext, WhoweareDtext,
      WhoweareBulletPoint1, WhoweareBulletPoint2, WhoweareBulletPoint3, WhoweareBulletPoint4,
      WhoweareCounter, WhoweareCounterText,
      Counter1, Counter2, Counter3, Counter4,
      CounterText1, CounterText2, CounterText3, CounterText4,
      OurmissionHText, OurmissionText,
      OurvisionHText, OurvisionText,
      WhychooseusTag, WhychooseusHtext,
      WhychooseusCardHtext1, WhychooseusCardDtext1,
      WhychooseusCardHtext2, WhychooseusCardDtext2,
      WhychooseusCardHtext3, WhychooseusCardDtext3,
      ContactHtext, ContactDtext
    };

    // Handle Images
    if (req.files && req.files.BannerImg) {
        const uploadRes = await uploadOnCloudinary(req.files.BannerImg[0].path);
        if (uploadRes?.url) updates.BannerImg = uploadRes.url;
    }

    if (req.files && req.files.WhoweareImg) {
        const uploadRes = await uploadOnCloudinary(req.files.WhoweareImg[0].path);
        if (uploadRes?.url) updates.WhoweareImg = uploadRes.url;
    }

    if (req.files && req.files.WhychooseusCardIcon1) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon1[0].path);
        if (uploadRes?.url) updates.WhychooseusCardIcon1 = uploadRes.url;
    }

    if (req.files && req.files.WhychooseusCardIcon2) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon2[0].path);
        if (uploadRes?.url) updates.WhychooseusCardIcon2 = uploadRes.url;
    }

    if (req.files && req.files.WhychooseusCardIcon3) {
        const uploadRes = await uploadOnCloudinary(req.files.WhychooseusCardIcon3[0].path);
        if (uploadRes?.url) updates.WhychooseusCardIcon3 = uploadRes.url;
    }

    // Clean undefined keys
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    // Update the SINGLE document found above (empty filter {})
    const updatedPage = await AboutPage.findOneAndUpdate({}, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "About Page updated successfully",
      data: updatedPage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};