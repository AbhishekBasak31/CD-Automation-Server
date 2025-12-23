import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeServiceSecSchema = new SCHEMA(
  {
    Htext:{
      type: String,
      required: true,
    },
  },{ timestamps: true }
);
export const HomeServiceSec = mongoose.model("HomeServiceSec", HomeServiceSecSchema);