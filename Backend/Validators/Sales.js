import joi from "joi";

export const saleSchema = joi.object({
  customerId: joi
    .string()
    .hex()
    .length(24)
    .required(),

  items: joi.array().items(
    joi.object({
      productId: joi
        .string()
        .hex()
        .length(24)
        .required(),

      quantity: joi.number().min(1).required(),

      price: joi.number().min(0).required(),
    })
  ).min(1).required(),

  totalAmount: joi.number().min(0).required(),

  paymentMethod: joi
    .string()
    .valid("Cash", "UPI", "Card")
    .required(),

  date: joi.date().optional(),
});

export const saleUpdateSchema = joi.object({
  customerId: joi
    .string()
    .hex()
    .length(24)
    .required(),

  items: joi.array().items(
    joi.object({
      productId: joi
        .string()
        .hex()
        .length(24)
        .required(),

      quantity: joi.number().min(1).required(),

      price: joi.number().min(0).required(),
    })
  ).min(1).required(),

  totalAmount: joi.number().min(0).required(),

  paymentMethod: joi
    .string()
    .valid("Cash", "UPI", "Card")
    .required(),

  date: joi.date().optional(),
});