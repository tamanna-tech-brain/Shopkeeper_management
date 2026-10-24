import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import path from "path";
import userRouter from "./Routers/User.js";
import customerRouter from "./Routers/Customer.js";
import supplierRouter from "./Routers/Supplier.js";
import salesRouter from "./Routers/Sales.js";
import expenseRouter from "./Routers/Expense.js";
import productRouter from "./Routers/Product.js";
import dashboardRouter from "./Routers/dashboardRoutes.js";
import invoiceRouter from "./Routers/invoiceRoutes.js";
import complaintRouter from "./Routers/Complaint.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// Express 5 compatibility: make req.query writable for xss-clean
app.use((req, res, next) => {
  try {
    const q = { ...req.query };
    Object.defineProperty(req, "query", {
      value: q,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } catch (e) {}
  next();
});

app.use(xss());

app.use(hpp());

app.use(mongoSanitize());

app.use(morgan("dev"));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, message: "Too many requests, please try again later." }
});

app.use(limiter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/product", productRouter);   
app.use("/api/sales", salesRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/complaint", complaintRouter);

export default app;