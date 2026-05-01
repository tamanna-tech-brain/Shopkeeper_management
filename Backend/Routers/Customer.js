import Router from "express";
import { validateAll } from "../middleware/validate.js";
import *as customerController from "../Controllers/Customer.js";
import { customerSchema, customerUpdateSchema } from "../Validators/Customer.js";
const customerRouter = Router();

customerRouter.post(
    "/create",
    validateAll(customerSchema),
    customerController.createCustomer);

customerRouter.get("/get", customerController.getCustomer);
customerRouter.get("/get/:id", customerController.getCustomerById);
customerRouter.put("/update/:id", validateAll(customerUpdateSchema) , customerController.updateCustomerById);
customerRouter.delete("/delete/:id", customerController.deleteCustomerById)
export default customerRouter



