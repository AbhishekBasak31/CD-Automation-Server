import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../Controllers/Global/Product.js"; 
import { authenticate } from "../../Middleware/AuthMiddlewares.js";
import { upload } from "../../Middleware/Multer.js";

const ProductRouter = express.Router();

const productUploads = upload.fields([
  { name: "Img1", maxCount: 1 },
  { name: "Img2", maxCount: 1 },
  { name: "Img3", maxCount: 1 },
  { name: "Img4", maxCount: 1 },
  { name: "Img5", maxCount: 1 }
]);

// Public Routes
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getProductById);

// Protected Routes
ProductRouter.use(authenticate);
ProductRouter.post("/", productUploads, createProduct);
ProductRouter.patch("/:id", productUploads, updateProduct);
ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter;