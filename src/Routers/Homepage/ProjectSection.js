import express from "express";
import {
  createHomeProjectSec,
  getAllHomeProjectSec,
  getLatestHomeProjectSec,
  updateHomeProjectSec,
  deleteHomeProjectSec,
} from "../../Controllers/Homepage/ProjectSection.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";

const HomeProjectSecRouter = express.Router();

/* CREATE */
HomeProjectSecRouter.post("/", authenticate, createHomeProjectSec);

/* GET */
HomeProjectSecRouter.get("/", getAllHomeProjectSec);
HomeProjectSecRouter.get("/latest", getLatestHomeProjectSec);

/* UPDATE */
HomeProjectSecRouter.patch("/", authenticate, updateHomeProjectSec);

/* DELETE */
HomeProjectSecRouter.delete("/", authenticate, deleteHomeProjectSec);

export default HomeProjectSecRouter;
