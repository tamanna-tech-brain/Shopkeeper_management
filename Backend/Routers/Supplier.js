import Router from "express";
import { validateAll } from "../middleware/validate.js";
import *as supplierController from "../Controllers/supplier.js";
import { supplierSchema, supplierUpdateSchema } from "../Validators/Supplier.js";
const supplierRouter = Router();

supplierRouter.post(
    "/create",
    validateAll(supplierSchema),
    supplierController.createSupplier);

supplierRouter.get("/get", supplierController.getSupplier);
supplierRouter.get("/get/:id", supplierController.getSupplierById);
supplierRouter.put("/update/:id", validateAll(supplierUpdateSchema) , supplierController.updateSupplierById);
supplierRouter.delete("/delete/:id", supplierController.deleteSupplierById)

export default supplierRouter;

