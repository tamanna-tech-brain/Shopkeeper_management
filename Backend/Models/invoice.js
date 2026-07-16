import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productName: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);