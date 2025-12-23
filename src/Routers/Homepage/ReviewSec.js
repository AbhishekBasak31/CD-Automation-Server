import express from "express";
import {
  createHomeReviewSec,
  getAllHomeReviewSec,
  updateHomeReviewSec,
} from "../../Controllers/Homepage/ReviewSec.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";


const HomeReviewSecRouter = express.Router();



HomeReviewSecRouter.get("/", getAllHomeReviewSec);

HomeReviewSecRouter.use(authenticate);
HomeReviewSecRouter.post("/",  createHomeReviewSec);
HomeReviewSecRouter.patch("/", updateHomeReviewSec);

export default HomeReviewSecRouter;