import joi from "joi";

export const supplierSchema = joi.object({
    name: joi.string().min(4).max(60).required(),
    phone: joi.string().pattern(/^[0-9]{10}$/).required(),
    address: joi.string().min(4).max(60).required(),
});

export const supplierUpdateSchema = joi.object({
    name: joi.string().min(4).max(60).required(),
    phone: joi.string().pattern(/^[0-9]{10}$/).required(),
    address: joi.string().min(4).max(60).required(),
});
export default {supplierSchema, supplierUpdateSchema};