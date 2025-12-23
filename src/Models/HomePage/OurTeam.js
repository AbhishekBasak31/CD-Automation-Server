import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const HomeOurteamSchema = new SCHEMA(
  {
    Htext: {
      type: String,
      required: true,
    },

    Dtext: {
      type: String,
      required: true,
    },

    // MUST BE AN ARRAY — NOT a single ObjectId
    Ourteam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "People",
      }
    ],
  },
  { timestamps: true }
);

export const HomeOurteam = mongoose.model("HomeOurteam", HomeOurteamSchema);
export default HomeOurteam;
