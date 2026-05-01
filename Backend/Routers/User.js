import { Router } from "express";
import { validateAll } from "../middleware/validate.js";
import * as userController from "../Controllers/user.js";
import {
  updateUserSchema,
  registerSchema,
  loginSchema,
  getUserIdSchema
} from "../Validators/User.js";

const userRouter = Router();

userRouter.post(
  "/create",
  validateAll(registerSchema),
  userController.register
);

userRouter.post(
  "/login",
  validateAll(loginSchema),
  userController.login
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