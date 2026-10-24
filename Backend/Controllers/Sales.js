import salesModel from "../Models/Sales.js";
import productModel from "../Models/Product.js";
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

    // Validate that stock is sufficient for all items before committing sale
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.productId && item.quantity) {
          const product = await productModel.findById(item.productId);
          if (!product) {
            return res.status(404).json({
              success: false,
              message: `Product with ID ${item.productId} was not found.`,
            });
          }
          if (product.stock < Number(item.quantity)) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
            });
          }
        }
      }
    }

    const salesCreate = await salesModel.create({
      customerId,
      items,
      totalAmount,
      paymentMethod,
      date,
    });

    // Automatically decrement inventory stock for purchased items
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.productId && item.quantity) {
          await productModel.findByIdAndUpdate(item.productId, {
            $inc: { stock: -Number(item.quantity) },
          });
        }
      }
    }

    // Emit live WebSocket notification for real-time Admin Dashboard updates
    try {
      const io = req.app?.get("io");
      if (io) {
        io.emit("new-order", salesCreate);
      }
    } catch (socketErr) {
      console.warn("Socket broadcast error:", socketErr.message);
    }

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

    // Restore stock if sale record is deleted
    if (Array.isArray(salesDeletes.items)) {
      for (const item of salesDeletes.items) {
        if (item.productId && item.quantity) {
          await productModel.findByIdAndUpdate(item.productId, {
            $inc: { stock: Number(item.quantity) },
          });
        }
      }
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