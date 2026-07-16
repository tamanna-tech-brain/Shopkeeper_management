import { io } from "../server.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // 🔴 REAL-TIME EVENT
    io.emit("new-order", order);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};