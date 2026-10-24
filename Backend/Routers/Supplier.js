import Router from "express";
import { validateAll } from "../Middleware/validate.js";
import *as supplierController from "../Controllers/Supplier.js";
import { supplierSchema, supplierUpdateSchema } from "../Validators/Supplier.js";
import upload from "../Middleware/upload.js";
const supplierRouter = Router();

supplierRouter.post(
    "/create",
    upload.single("image"),
    validateAll(supplierSchema),
    supplierController.createSupplier);

supplierRouter.get("/get", supplierController.getSupplier);
supplierRouter.get("/get/:id", supplierController.getSupplierById);
supplierRouter.put("/update/:id", upload.single("image"), validateAll(supplierUpdateSchema) , supplierController.updateSupplierById);
supplierRouter.delete("/delete/:id", supplierController.deleteSupplierById)

export default supplierRouter;

