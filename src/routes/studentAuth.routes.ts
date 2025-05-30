import express from "express";
import { studentLogin } from "../controllers/studentLogin.controller";

const router = express.Router();

router.post("/login", studentLogin);

export default router;
