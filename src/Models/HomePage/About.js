import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeAboutSchema = new SCHEMA(
  {
    Img1:{
        type: String,
      required: true,
     
   },
    Img2:{
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
   Tag1:{
        type: String,
      required: true,
     
   }, 
    Tag2:{
        type: String,
      required: true,
     
   }, 
    Tag3:{
        type: String,
      required: true,
     
   }, 
   Tag1bp1:{
       type: String,
      required: true,
   },
    Tag1bp2:{
       type: String,
      required: true,
   },
    Tag1bp3:{
       type: String,
      required: true,
   },

    Tag2bp1:{
       type: String,
      required: true,
   },
    Tag2bp2:{
       type: String,
      required: true,
   },
    Tag2bp3:{
       type: String,
      required: true,
   },
    Tag2bp1:{
       type: String,
      required: true,
   },
    Tag2bp2:{
       type: String,
      required: true,
   },
    Tag2bp3:{
       type: String,
      required: true,
   },
       Tag3bp1:{
       type: String,
      required: true,
   },
    Tag3bp2:{
       type: String,
      required: true,
   },
    Tag3bp3:{
       type: String,
      required: true,
   }
  },{ timestamps: true }
);
export const HomeAbout = mongoose.model("HomeAbout", HomeAboutSchema);