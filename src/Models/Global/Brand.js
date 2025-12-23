import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ProductBrandSchema = new SCHEMA(
  {
    Img:{
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    Dtext:{
    type: String,
      require: true,
    },
    products:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",   
    }]

  
  },{ timestamps: true }
);
export const ProductBrand = mongoose.model("ProductBrand", ProductBrandSchema);