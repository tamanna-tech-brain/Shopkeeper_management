import Router from "express";
import { validateAll } from "../middleware/validate.js";
import *as salesController from "../Controllers/Sales.js";
import { saleSchema, saleUpdateSchema } from "../Validators/Sales.js";
const salesRouter = Router();

salesRouter.post(
    "/create",
    validateAll(saleSchema),
    salesController.createSales);

salesRouter.get("/get", salesController.getSales);
salesRouter.get("/get/:id", salesController.getSalesById);
salesRouter.put("/update/:id", validateAll(saleUpdateSchema) , salesController.updateSalesById);
salesRouter.delete("/delete/:id", salesController.deleteSalesById)



export default salesRouter;