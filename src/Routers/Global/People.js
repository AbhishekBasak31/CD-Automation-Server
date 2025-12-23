import express from "express";
import { upload } from "../../Middleware/Multer.js";
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { createPeople, getAllPeople, deletePeople, updatePeople } from "../../Controllers/Global/People.js";

const PeopleRouter = express.Router();
const uploadImg =  upload.single("Img")

PeopleRouter.post("/", authenticate,uploadImg , createPeople);
PeopleRouter.get("/", getAllPeople);
PeopleRouter.patch("/:id", authenticate, uploadImg , updatePeople);
PeopleRouter.delete("/:id", authenticate, deletePeople);

export default PeopleRouter;
