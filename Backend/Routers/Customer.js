import Router from "express";
import { validateAll } from "../Middleware/validate.js";
import *as customerController from "../Controllers/Customer.js";
import { customerSchema, customerUpdateSchema } from "../Validators/Customer.js";
import upload from "../Middleware/upload.js";
const customerRouter = Router();

customerRouter.post(
    "/create",
    upload.single("image"),
    validateAll(customerSchema),
    customerController.createCustomer);

customerRouter.get("/get", customerController.getCustomer);
customerRouter.get("/get/:id", customerController.getCustomerById);
customerRouter.put("/update/:id", upload.single("image"), validateAll(customerUpdateSchema) , customerController.updateCustomerById);
customerRouter.delete("/delete/:id", customerController.deleteCustomerById)
export default customerRouter;



