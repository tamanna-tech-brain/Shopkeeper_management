import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import userRouter from "./Routers/User.js";
import customerRouter from "./Routers/Customer.js";
import supplierRouter from "./Routers/Supplier.js";
import salesRouter from "./Routers/Sales.js";
import expenseRouter from "./Routers/Expense.js";
import productRouter from "./Routers/Product.js";
import dashboardRouter from "./Routers/dashboardRoutes.js";
import invoiceRouter from "./Routers/invoiceRoutes.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(helmet());

app.use(xss());

app.use(hpp());

app.use(mongoSanitize());

app.use(morgan("dev"));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/product", productRouter);   
app.use("/api/sales", salesRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/invoice", invoiceRouter);

export default app;