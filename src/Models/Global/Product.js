
// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ProductSchema = new SCHEMA(
  {
    BrandId:{
    type: mongoose.Schema.Types.ObjectId,
        ref: "ProductBrand",
    },
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
    Img4:{
      type: String,
      required: true,
     
   },
    Img5:{
      type: String,
      required: true,
     
   },
   name:{
        type: String,
      required: true,
   },
    Dtext:{
        type: String,
      required: true,
     
   }, 
   KeyHighlights1:{
     type: String,
      required: true,
   },
    KeyHighlights2:{
      type: String,
      required: true,
   },
    KeyHighlights3:{
      type: String,
      required: true,
   },
    KeyHighlights4:{
      type: String,
      required: true,
   },   
    KeyHighlights5:{
      type: String,
      required: true,
   }, 
    KeyHighlights6:{
      type: String,
      required: false,
   },
    KeyHighlights7:{
      type: String,
      required: false,
   },  
    KeyHighlights8:{
      type: String,
      required: false,
   },
    KeyHighlights9:{
      type: String,
      required: false,
   },
    KeyHighlights10:{
      type: String,
      required: false,
   },
   TechnicalSpecs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechSpec",  
   }],
   Application:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application", 
   }],
   Active:{
         type: Boolean,
         default:true
   }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
export default Product;
