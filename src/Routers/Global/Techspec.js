import express from "express";
import { createTechSpec, updateTechSpec, deleteTechSpec } from "../../Controllers/Global/TechSpec.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";

const TechSpecRouter = express.Router();

TechSpecRouter.use(authenticate);

TechSpecRouter.post("/", createTechSpec);
TechSpecRouter.patch("/:id", updateTechSpec);
TechSpecRouter.delete("/:id", deleteTechSpec);

export default TechSpecRouter;