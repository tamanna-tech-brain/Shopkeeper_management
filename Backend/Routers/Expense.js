import Router from "express";
import { validateAll } from "../Middleware/validate.js";
import *as expenseController from "../Controllers/Expense.js";
import { expenseSchema, expenseUpdateSchema } from "../Validators/Expense.js";
import upload from "../Middleware/upload.js";
const expenseRouter = Router();

expenseRouter.post(
    "/create",
    upload.single("receiptImage"),
    validateAll(expenseSchema),
    expenseController.createExpense);

expenseRouter.get("/get", expenseController.getExpenses);
expenseRouter.get("/get/:id", expenseController.getExpensesById);
expenseRouter.put("/update/:id", upload.single("receiptImage"), validateAll(expenseUpdateSchema) , expenseController.updateExpensesById);
expenseRouter.delete("/delete/:id", expenseController.deleteExpenseById)


export default expenseRouter;
