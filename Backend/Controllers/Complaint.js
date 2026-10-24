import Complaint from "../Models/Complaint.js";
import { getPagination } from "../utils/Pagination.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, type, partyName, contact, description, priority } = req.body;
    const evidenceImage = req.file?.path || (req.file?.filename ? `/uploads/${req.file.filename}` : req.body.evidenceImage || "");

    const complaint = await Complaint.create({
      title,
      type: type || "Customer",
      partyName: partyName || "General Store / Walk-in",
      contact: contact || "",
      description,
      priority: priority || "Medium",
      evidenceImage,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      data: complaint,
      message: "Grievance / Complaint submitted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "", status = "all", type = "all" } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { partyName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (type && type !== "all") {
      query.type = type;
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const updatePayload = {
      status: status || "Resolved",
      resolutionNotes: resolutionNotes || "",
      resolvedAt: status === "Resolved" ? new Date() : null,
    };

    if (req.file) {
      updatePayload.evidenceImage = req.file.path || (req.file.filename ? `/uploads/${req.file.filename}` : undefined);
    }

    const updated = await Complaint.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: "Complaint status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Complaint record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
