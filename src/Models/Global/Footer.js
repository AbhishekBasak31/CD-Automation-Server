// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const FooterSchema = new SCHEMA(
  {
   socials:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "Social",
     
   }],
   logo:{
        type: String,
      required: true,
   },
   Img:{
        type: String,
      required: true,
   },
    copyright:{
        type: String,
      required: true,
     
   },   
   
  },
  { timestamps: true }
);

export const Footer = mongoose.model("Footer", FooterSchema);
export default Footer;
