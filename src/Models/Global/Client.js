import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ClientSchema = new SCHEMA(
  {
    name: {
      type: String,
      required: true,
    },
    img:{
      type: String,
      required: true,
    },
    Dtext:{
      type: String,
      required: true,
    },
  
  },{ timestamps: true }
);
export const Client = mongoose.model("Client", ClientSchema);