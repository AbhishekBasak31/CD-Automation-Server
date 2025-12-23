import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeReviewSecSchema = new SCHEMA(
  {
    Htext:{
        type: String,
      required: true,
     
   },

   Reviews:[{
     type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
   }]
   
  
  },{ timestamps: true }
);
export const HomeReviewSec = mongoose.model("HomeReviewSec", HomeReviewSecSchema);