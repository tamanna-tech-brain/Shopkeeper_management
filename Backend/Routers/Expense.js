import Router from "express";
import { validateAll } from "../middleware/validate.js";
import *as expenseController from "../Controllers/Expense.js";
import { expenseSchema, expenseUpdateSchema } from "../Validators/Expense.js";
const expenseRouter = Router();

expenseRouter.post(
    "/create",
    validateAll(expenseSchema),
    expenseController.createExpense);

expenseRouter.get("/get", expenseController.getExpenses);
expenseRouter.get("/get/:id", expenseController.getExpensesById);
expenseRouter.put("/update/:id", validateAll(expenseUpdateSchema) , expenseController.updateExpensesById);
expenseRouter.delete("/delete/:id", expenseController.deleteExpenseById)


export default expenseRouter;
