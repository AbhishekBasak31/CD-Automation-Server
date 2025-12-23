import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const AboutBannerSchema = new SCHEMA(
  {
    Img:{
        type: String,
      required: true,   
   },
    Htext:{
        type: String,
      required: true,   
   },
    Dtext:{
        type: String,
      required: true,
   }, 
  },{ timestamps: true }
);
export const AboutBanner = mongoose.model("AboutBanner", AboutBannerSchema);