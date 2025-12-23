// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const PeopleSchema = new SCHEMA(
  {
   Img:{
      type: String,
      required: true,
     
   },
   Htext:{
        type: String,
      required: true,
   },
   Desig:{
        type: String,
      required: true,
   },
    Quote:{
        type: String,
      required: true,
   },   
   
  },
  { timestamps: true }
);

export const People = mongoose.model("People", PeopleSchema);
export default People;
