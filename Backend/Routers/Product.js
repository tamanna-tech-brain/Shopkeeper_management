import Router from "express";
import { validateAll } from "../middleware/validate.js";
import *as productController from "../Controllers/Product.js";
import { productSchema, productUpdateSchema } from "../Validators/Product.js";
const productRouter = Router();

productRouter.post(
    "/create",
    validateAll(productSchema),
    productController.createProduct);

productRouter.get("/get", productController.getProduct);
productRouter.get("/get/:id", productController.getProductById);
productRouter.put("/update/:id", validateAll(productUpdateSchema) , productController.updateProductById);
productRouter.delete("/delete/:id", productController.deleteProductById)



export default productRouter;