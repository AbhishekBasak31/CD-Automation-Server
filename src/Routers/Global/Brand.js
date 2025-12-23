import express from "express";
import {
  createProductBrand,
  getAllProductBrands,
  updateProductBrand,
  deleteProductBrand,
  getProductBrandById,
} from "../../Controllers/Global/Brand.js"; // Adjust path
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ProductBrandRouter = express.Router();
const uploadMiddleware = upload.single("Img"); 

ProductBrandRouter.get("/", getAllProductBrands);
ProductBrandRouter.get("/:id", getProductBrandById); // <--- Add this Route
ProductBrandRouter.use(authenticate);

// Create (Multipart: Img + name, Dtext)
ProductBrandRouter.post("/", uploadMiddleware, createProductBrand);

// Update (Multipart: optional Img + fields)
ProductBrandRouter.patch("/:id", uploadMiddleware, updateProductBrand);

// Delete
ProductBrandRouter.delete("/:id", deleteProductBrand);

export default ProductBrandRouter;