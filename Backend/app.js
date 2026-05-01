import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "./Routers/User.js";
import customerRouter from "./Routers/Customer.js";
import supplierRouter from "./Routers/Supplier.js";
import salesRouter from "./Routers/Sales.js";
import expenseRouter from "./Routers/Expense.js";
import productRouter from "./Routers/Product.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/product", productRouter); // ✅ fixed slash
app.use("/api/sales", salesRouter);
app.use("/api/supplier", supplierRouter);

export default app;