import joi from "joi";

export const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

export const getUserIdSchema = joi.object({
    id: joi.string().length(24).hex().required()
});

export const updateUserSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})

export default { registerSchema, loginSchema, getUserIdSchema, updateUserSchema};