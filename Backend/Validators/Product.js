import joi from "joi";

export const productSchema = joi.object({
    name: joi.string().min(4).max(60).required(),
    category: joi.string().min(4).max(60).required(),
    price: joi.number().required(),
    stock: joi.number().min(0).required(),
    barcode: joi.string().optional(),
    supplierId: joi.required(),

});

export const productUpdateSchema = joi.object({
    name: joi.string().min(4).max(60).optional(),
    category: joi.string().min(4).max(60).optional(),
    price: joi.number().optional(),
    stock: joi.number().min(0).optional(),
    barcode: joi.string().optional(),
    supplierId: joi.optional(),

});
export default {productSchema, productUpdateSchema};