import express from "express";
import protect from "../Middleware/authMiddleware.js";
import authorizeRoles from "../Middleware/roleMiddleware.js";

import {
  createInvoice,
  getInvoiceById,
} from "../Controllers/invoiceController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createInvoice
);

router.get(
  "/:id",
  protect,
  getInvoiceById
);

export default router;