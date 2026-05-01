import joi from "joi";

export const productSchema = joi.object({
    name: joi.string().min(4).max(60).required(),
    category: joi.string().min(4).max(60).required(),
    price: joi.number().required(),
    stock: joi.number().min(1).required(),
    barcode: joi.string().optional(),
    supplierId: joi.required(),

});

export const productUpdateSchema = joi.object({
    name: joi.string().min(4).max(60).required(),
    category: joi.string().min(4).max(60).required(),
    price: joi.number().required(),
    stock: joi.number().min(1).required(),
    barcode: joi.string().optional(),
    supplierId: joi.required(),

});
export default {productSchema, productUpdateSchema};