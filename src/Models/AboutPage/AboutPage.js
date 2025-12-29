import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const AboutPageSchema = new SCHEMA(
  {
    BannerImg:{
        type: String,
      required: true,   
   },
    BannerHtext:{
        type: String,
      required: true,   
   },
    BannerDtext:{
        type: String,
      required: true,
   }, 
   WhoweareImg:{
       type: String,
      required: true,
   },
   WhoweareTag:{
      type: String,
      required: true,
   },
WhoweareHtext:{
  type:String,
  require:true
},
WhoweareDtext:{
  type:String,
  require:true
},
WhoweareBulletPoint1:{
  type:String,
  require:true
},
WhoweareBulletPoint2:{
  type:String,
  require:true
},
WhoweareBulletPoint3:{
  type:String,
  require:true
},
WhoweareBulletPoint4:{
  type:String,
  require:true
},
WhoweareCounter:{
    type:String,
  require:true
},
WhoweareCounterText:{
      type:String,
  require:true
},
Counter1:{
        type:String,
  require:true
},
Counter2:{
        type:String,
  require:true
},
Counter3:{
        type:String,
  require:true
},
Counter4:{
        type:String,
  require:true
},
CounterText1:{
  type:String,
  require:true
},
CounterText2:{
  type:String,
  require:true
},
CounterText3:{
  type:String,
  require:true
},
CounterText4:{
  type:String,
  require:true
},
Directors:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Director",   // ✅ FIXED NAME
}],
OurmissionHText:{
  type:String,
  require:true
},
OurmissionText:{
  type:String,
  require:true
},
OurvisionHText:{
  type:String,
  require:true
},
OurvisionText:{
  type:String,
  require:true
},
WhychooseusTag:{
  type:String,
  require:true
},
WhychooseusHtext:{
  type:String,
  require:true
},

WhychooseusCardIcon1:{
  type:String,
  require:true
},
WhychooseusCardHtext1:{
  type:String,
  require:true
},
WhychooseusCardDtext1:{
  type:String,
  require:true
},

WhychooseusCardIcon2:{
  type:String,
  require:true
},
WhychooseusCardHtext2:{
  type:String,
  require:true
},
WhychooseusCardDtext2:{
  type:String,
  require:true
},
WhychooseusCardIcon3:{
  type:String,
  require:true
},
WhychooseusCardHtext3:{
  type:String,
  require:true
},
WhychooseusCardDtext3:{
  type:String,
  require:true
},
ContactHtext:{
    type:String,
  require:true
},
ContactDtext:{
    type:String,
  require:true
}
  },{ timestamps: true }
);
export const AboutPage = mongoose.model("AboutPage", AboutPageSchema);