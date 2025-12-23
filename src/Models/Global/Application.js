import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ApplicationSchema = new SCHEMA(
  {
  img:{
    type: String,
    required: true,
  },
  application:{
    type: String,
    required: true,
  },
 ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",  
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", ApplicationSchema);
