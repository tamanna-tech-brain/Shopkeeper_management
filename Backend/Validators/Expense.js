import joi from "joi";

export const expenseSchema = joi.object({
    title: joi.string().min(4).max(60).required(),
    amount: joi.number().min(0).required(),
    category: joi.string().min(3).max(60).required(),
    date: joi.date().required(),

});

export const expenseUpdateSchema = joi.object({
    title: joi.string().min(4).max(60).required(),
    amount: joi.number().min(0).required(),
    category: joi.string().min(3).required(),
    date: joi.date().required(),

});
export default {expenseSchema, expenseUpdateSchema};