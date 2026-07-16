import { Router } from "express";
import { validateAll } from "../Middleware/validate.js";
import * as productController from "../Controllers/Product.js";
import { productSchema, productUpdateSchema } from "../Validators/Product.js";
import upload from "../Middleware/upload.js";

const productRouter = Router();

productRouter.post(
    "/create",
    upload.single("image"),
    validateAll(productSchema),
    productController.createProduct
);

productRouter.get("/get", productController.getProduct);
productRouter.get("/get/:id", productController.getProductById);

productRouter.put(
    "/update/:id",
    upload.single("image"),
    validateAll(productUpdateSchema),
    productController.updateProductById
);

productRouter.delete("/delete/:id", productController.deleteProductById);

export default productRouter;