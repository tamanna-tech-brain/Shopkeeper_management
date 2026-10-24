import { Router } from "express";
import upload from "../Middleware/upload.js";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  resolveComplaint,
  deleteComplaint,
} from "../Controllers/Complaint.js";

const complaintRouter = Router();

complaintRouter.post("/create", upload.single("evidenceImage"), createComplaint);
complaintRouter.get("/get", getComplaints);
complaintRouter.get("/get/:id", getComplaintById);
complaintRouter.put("/resolve/:id", upload.single("evidenceImage"), resolveComplaint);
complaintRouter.delete("/delete/:id", deleteComplaint);

export default complaintRouter;
