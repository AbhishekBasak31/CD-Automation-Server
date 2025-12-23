import express from "express";
import {
  createHomeOurteam,
  getAllHomeOurteam,
  getLatestHomeOurteam,
  updateHomeOurteam,
  deleteHomeOurteam,
} from "../../Controllers/Homepage/OurTeam.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";

const HomeOurTeamRouter = express.Router();

HomeOurTeamRouter.post("/", authenticate, createHomeOurteam);
HomeOurTeamRouter.get("/", getAllHomeOurteam);
HomeOurTeamRouter.patch("/", authenticate, updateHomeOurteam);
HomeOurTeamRouter.delete("/", authenticate, deleteHomeOurteam);

export default HomeOurTeamRouter;
