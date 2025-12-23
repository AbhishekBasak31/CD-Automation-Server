import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ServiceSecSchema = new SCHEMA(
  {
    Img1:{
      type: String,
      required: true,
    },
    Img2:{
      type: String,
      required: true,
    },
    Img3:{
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
   tag:{
      type: String,
      required: true,
   },
   bulletpoint1:{
          type: String,
      required: true,
   },
      bulletpoint2:{
          type: String,
      required: true,
   },
      bulletpoint3:{
          type: String,
      required: true,
   }
  },{ timestamps: true }
);
export const Service = mongoose.model("Service", ServiceSecSchema);