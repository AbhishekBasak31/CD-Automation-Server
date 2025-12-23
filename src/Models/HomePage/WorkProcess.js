import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeWorkProcessSchema = new SCHEMA(
  {
    MainHtext:{
        type: String,
      required: true,
     
   }, 
   MainDtext:{
        type: String,
      required: true,
     
   }, 
   Card1Stepno:{
      type: String,
      required: true,
   },
   Card1Name:{
     type: String,
      required: true,
   },
   Card1Dtext:{
     type: String,
      required: true,
   },
    Card2Stepno:{
      type: String,
      required: true,
   },
   Card2Name:{
     type: String,
      required: true,
   },
   Card2Dtext:{
     type: String,
      required: true,
   },
      Card3Stepno:{
      type: String,
      required: true,
   },
   Card3Name:{
     type: String,
      required: true,
   },
   Card3Dtext:{
     type: String,
      required: true,
   },
   Card4Stepno:{
      type: String,
      required: true,
   },
   Card4Name:{
     type: String,
      required: true,
   },
   Card4Dtext:{
     type: String,
      required: true,
   },
   Card5Stepno:{
      type: String,
      required: true,
   },
   Card5Name:{
     type: String,
      required: true,
   },
   Card5Dtext:{
     type: String,
      required: true,
   },

   Card6Stepno:{
      type: String,
      required: false,
   },
   Card6Name:{
     type: String,
      required: false,
   },
   Card6Dtext:{
     type: String,
      required: false,
   },
      Card7Stepno:{
      type: String,
      required: false,
   },
   Card7Name:{
     type: String,
      required: false,
   },
   Card7Dtext:{
     type: String,
      required: false,
   },
         Card8Stepno:{
      type: String,
      required: false,
   },
   Card8Name:{
     type: String,
      required: false,
   },
   Card8Dtext:{
     type: String,
      required: false,
   },
         Card9Stepno:{
      type: String,
      required: false,
   },
   Card9Name:{
     type: String,
      required: false,
   },
   Card9Dtext:{
     type: String,
      required: false,
   },
   Card10Stepno:{
      type: String,
      required: false,
   },
   Card10Name:{
     type: String,
      required: false,
   },
   Card10Dtext:{
     type: String,
      required: false,
   },
  },{ timestamps: true }
);
export const HomeWorkProcess = mongoose.model("HomeWorkProcess", HomeWorkProcessSchema);