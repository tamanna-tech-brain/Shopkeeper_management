import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Customer", "Supplier", "Staff Welfare", "Product Quality", "Store Operations"],
      default: "Customer",
    },
    partyName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    contact: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Rejected"],
      default: "Pending",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
    evidenceImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
