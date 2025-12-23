import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeWhychooseUsSchema = new SCHEMA(
  {
    Htext:{
      type: String,
      required: true,
    },
      Dtext:{
      type: String,
      required: true,
    },
    BPoint1:{
            type: String,
      required: true,  
    },
    BPoint2:{
            type: String,
      required: true,  
    },
    BgImg:{
      type: String,
      required: true,    
    },
    Card1Counter:{
           type: String,
      required: true,      
    },
    Card1Text:{
           type: String,
      required: true,      
    },
    Card2Counter:{
           type: String,
      required: true,      
    },
    Card2Text:{
           type: String,
      required: true,      
    },
    Card3Counter:{
           type: String,
      required: true,      
    },
    Card3Text:{
           type: String,
      required: true,      
    },
    Card4Counter:{
           type: String,
      required: true,      
    },
    Card4Text:{
           type: String,
      required: true,      
    }
  },{ timestamps: true }
);
export const HomeWhychooseUs = mongoose.model("HomeWhychooseUs ", HomeWhychooseUsSchema);