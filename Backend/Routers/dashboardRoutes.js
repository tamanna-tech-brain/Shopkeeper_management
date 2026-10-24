import express from "express";

import protect from "../Middleware/authMiddleware.js";

import authorizeRoles from "../Middleware/roleMiddleware.js";

import { getDashboardStats }
from "../Controllers/dashboardController.js";

const router = express.Router();

router.get(
    "/stats",
    protect,
    authorizeRoles("admin", "staff"),
    getDashboardStats
);

export default router;