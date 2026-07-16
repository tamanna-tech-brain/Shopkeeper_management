import { Router } from "express";
import { validateAll } from "../Middleware/validate.js";
import * as userController from "../Controllers/User.js";
import {
  updateUserSchema,
  registerSchema,
  loginSchema,
  getUserIdSchema
} from "../Validators/User.js";

const userRouter = Router();

userRouter.post(
  "/register",
  validateAll(registerSchema),
  userController.registerUser
);

userRouter.post(
  "/login",
  validateAll(loginSchema),
  userController.loginUser
);

userRouter.get(
  "/get/:id",
  validateAll(getUserIdSchema, "params"),
  userController.getUserById
);

userRouter.put(
  "/update/:id",
  validateAll(updateUserSchema),
  userController.updateUserById
);

userRouter.delete(
  "/delete/:id",
  userController.deleteUserById
);

export default userRouter;