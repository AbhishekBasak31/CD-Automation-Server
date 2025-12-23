import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ContactDetailsSchema = new SCHEMA(
  {
    Htext:{
      type: String,
      required: true,
    },
    Dtext:{
      type: String,
      required: true,
    },
    whour: {
      type: String,
      required: true,
    },
    email:{
    type: String,
      require: true,
    },
    phone:{
        type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    map:{
      type: String,
      require: true,
    }
  
  },{ timestamps: true }
);
export const ContactDetails = mongoose.model("ContactDetails", ContactDetailsSchema);