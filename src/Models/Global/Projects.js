
// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ProjectSchema = new SCHEMA(
  {
   Img:{
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
   
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
export default Project;
