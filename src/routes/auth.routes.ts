import express from "express";
import { register, login, studentLogin } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/studentLogin", studentLogin);

export default router;
