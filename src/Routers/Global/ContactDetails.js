// src/Router/Global/ContactDetails.js
import express from "express";
import {
  createContactDetails,
  getAllContactDetails,
  updateContactDetails,
  deleteContactDetails,
} from "../../Controllers/Global/ContactDetails.js";

import { authenticate } from "../../Middleware/AuthMiddlewares.js";

const ContactDetailsRouter = express.Router();

/**
 * Public routes
 */
ContactDetailsRouter.get("/", getAllContactDetails);

// Secure routes — require authentication
ContactDetailsRouter.use(authenticate);

ContactDetailsRouter
  .route("/")
  .post(createContactDetails)   // create new contact details
  .patch(updateContactDetails)    // update latest or provided id (id in body)
  .delete(deleteContactDetails); // delete latest or provided id (id in body)

export default ContactDetailsRouter;
