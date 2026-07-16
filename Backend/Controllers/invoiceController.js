import Invoice from "../Models/invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const { orderId, userId, items, totalAmount, tax } = req.body;

    const finalAmount = totalAmount + (tax || 0);

    const invoice = await Invoice.create({
      orderId,
      userId,
      items,
      totalAmount,
      tax,
      finalAmount,
    });

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("userId")
      .populate("orderId");

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};