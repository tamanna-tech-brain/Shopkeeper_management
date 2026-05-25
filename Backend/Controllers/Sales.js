import salesModel from "../Models/Sales.js";
import { getPagination } from "../utils/Pagination.js";
import { getSearchMatch } from "../utils/search.js";

export async function createSales(req, res) {
  try {

    const {
      customerId,
      items,
      totalAmount,
      paymentMethod,
      date,
    } = req.body;
    console.log("body to create", {
      customerId,
      items,
      totalAmount,
      paymentMethod,
      date,
        })
    const salesCreate = await salesModel.create({
      customerId,
      items,
      totalAmount,
      paymentMethod,
      date,
    });
     console.log("after  create", salesCreate)

    return res.status(201).json({
      success: true,
      data: salesCreate,
      message: "Sales created successfully",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

export async function getSales(req, res) {

  try {

    const { page, limit, skip } = getPagination(req.query);

    const { search = "" } = req.query;

    const matchStage = getSearchMatch(
      search,
      "paymentMethod"
    );

    const total = await salesModel.countDocuments(
      matchStage
    );

    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    );

    const currentPage =
      page > totalPages ? totalPages : page;

    const finalSkip =
      (currentPage - 1) * limit;

    const salesGets = await salesModel
      .find(matchStage)
      .populate("customerId")
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .skip(finalSkip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: salesGets,
      pagination: {
        total,
        page: currentPage,
        limit,
        totalPages,
      },
      message: "Sales fetched successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}   

export async function getSalesById(req, res) {

  try {

    const { id } = req.params;

    const salesGetById = await salesModel
      .findById(id)
      .populate("customerId")
      .populate("items.productId");

    if (!salesGetById) {

      return res.status(404).json({
        success: false,
        message: "Sales not found",
      });

    }

    return res.status(200).json({
      success: true,
      data: salesGetById,
      message: "Sales found successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}

export async function updateSalesById(req, res) {

  try {

    const { id } = req.params;

    const salesUpdates = await salesModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!salesUpdates) {

      return res.status(404).json({
        success: false,
        message: "Sales not found",
      });

    }

    return res.status(200).json({
      success: true,
      data: salesUpdates,
      message: "Sales updated successfully",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

export async function deleteSalesById(req, res) {

  try {

    const { id } = req.params;

    console.log("DELETE ID:", id);

    const salesDeletes = await salesModel.findByIdAndDelete(id);

    console.log("DELETED:", salesDeletes);

    if (!salesDeletes) {

      return res.status(404).json({
        success: false,
        message: "Sales not found",
      });

    }

    return res.status(200).json({
      success: true,
      data: salesDeletes,
      message: "Sales deleted successfully",
    });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}