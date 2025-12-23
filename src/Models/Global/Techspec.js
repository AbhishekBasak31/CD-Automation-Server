import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const TechSpecSchema = new SCHEMA(
  {
  Key:{
    type: String,
    required: true,
  },
  value:{
    type: String,
    required: true,
  },
 ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",   // ✅ FIXED NAME
    },
  },
  { timestamps: true }
);

export const TechSpec = mongoose.model("TechSpec", TechSpecSchema);
