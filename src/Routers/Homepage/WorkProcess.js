// Server/src/Routes/homeWorkProcessRoutes.js
import express from "express";
import {
  newWorkProcess,
  getAllWorkProcesses,
  updateWorkProcess,
  deleteWorkProcess,
} from "../../Controllers/Homepage/WorkProcess.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";
// import { upload } from "../../Middleware/Multer.js"; // your multer setup

const HomeWorkProcessRouter = express.Router();

// const imageFields = [
//   { name: "Tab1CardImg1", maxCount: 1 },
//   { name: "Tab1CardImg2", maxCount: 1 },
//   { name: "Tab1CardImg3", maxCount: 1 },
//   { name: "Tab1CardImg4", maxCount: 1 },

//   { name: "Tab2CardImg1", maxCount: 1 },
//   { name: "Tab2CardImg2", maxCount: 1 },
//   { name: "Tab2CardImg3", maxCount: 1 },
//   { name: "Tab2CardImg4", maxCount: 1 },

//   { name: "Tab3CardImg1", maxCount: 1 },
//   { name: "Tab3CardImg2", maxCount: 1 },
//   { name: "Tab3CardImg3", maxCount: 1 },
//   { name: "Tab3CardImg4", maxCount: 1 },

//   { name: "Tab4CardImg1", maxCount: 1 },
//   { name: "Tab4CardImg2", maxCount: 1 },
//   { name: "Tab4CardImg3", maxCount: 1 },
//   { name: "Tab4CardImg4", maxCount: 1 },
// ];

// const imagesFieldsHandler = upload.fields(imageFields);

// NEW (create) -> POST /new
HomeWorkProcessRouter.post("/", authenticate,newWorkProcess);

// list
HomeWorkProcessRouter.get("/", getAllWorkProcesses);

// update (patch)
HomeWorkProcessRouter.patch("/", authenticate,updateWorkProcess);

// delete
HomeWorkProcessRouter.delete("/", authenticate, deleteWorkProcess);

export default HomeWorkProcessRouter;

