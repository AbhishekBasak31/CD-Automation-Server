import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const CareerPageSchema = new SCHEMA(
  {
  WhyJoinUsHtext:{
    type: String,
    required: true,
  },
  WhyJoinUsDtext:{
    type: String,
    required: true,
  },
  WhyJoinUsCardIcon1:{
    type: String,
    required: true,
  },
WhyJoinUsCardIcon2:{
    type: String,
    required: true,
  },
    WhyJoinUsCardIcon3:{
    type: String,
    required: true,
  },
    WhyJoinUsCardHtext1:{
    type: String,
    required: true,
  },
 WhyJoinUsCardHtext2:{
    type: String,
    required: true,
  },
    WhyJoinUsCardHtext3:{
    type: String,
    required: true,
  },
  WhyJoinUsCardDtext1:{
    type: String,
    required: true,
  },
  WhyJoinUsCardDtext2:{
    type: String,
    required: true,
  },
  WhyJoinUsCardDtext3:{
    type: String,
    required: true,
  },
  },
  { timestamps: true }
);

export const CareerPage = mongoose.model("CareerPage", CareerPageSchema);
