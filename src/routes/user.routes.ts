import { Router } from "express";
import { getUser, getUsers } from "../controller/user.controller/user.controller";

const userRoutes = Router();

userRoutes.route('/')
.get(getUsers)

userRoutes.route('/')
.get(getUser)

export default userRoutes;