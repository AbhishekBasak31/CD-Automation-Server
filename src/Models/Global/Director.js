import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const DirectorSchema = new SCHEMA(
  {
    DirectorImg:{
      type: String,
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    desig:{
      type: String,
      required: true,
    },
    Dtext:{
      type: String,
      require: true,
    },
    LinkdinId:{
     type: String, 
     require: false,
    }
  },{ timestamps: true }
);
export const Director = mongoose.model("Director", DirectorSchema);