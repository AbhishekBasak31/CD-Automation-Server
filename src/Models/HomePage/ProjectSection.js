import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeProjectSecSchema = new SCHEMA(
  {
    Htext:{
        type: String,
      required: true,
     
   },
   Projects:[{
     type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
   }]
   
  
  },{ timestamps: true }
);
export const HomeProjectSec = mongoose.model("HomeProjectSec", HomeProjectSecSchema);