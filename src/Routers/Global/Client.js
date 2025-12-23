import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} from "../../Controllers/Global/Client.js"; // Adjust path
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ClientRouter = express.Router();
const uploadMiddleware = upload.single("img"); // Expecting 'img' field

/* PUBLIC GET */
ClientRouter.get("/", getAllClients);

/* PROTECTED ROUTES */
ClientRouter.use(authenticate);

// Create (Multipart: img + name, Dtext)
ClientRouter.post("/", uploadMiddleware, createClient);

// Update (Multipart: optional img + fields)
ClientRouter.patch("/:id", uploadMiddleware, updateClient);

// Delete
ClientRouter.delete("/:id", deleteClient);

export default ClientRouter;