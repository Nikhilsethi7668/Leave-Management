import express from "express";
const router = express.Router();
import {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
} from "../Controllers/department.controller.js";
import { auth, isAdmin } from "../Middlewares/auth.middleware.js";

router.post("/", auth, isAdmin, createDepartment);

router.get("/", getAllDepartments);

router.delete("/:id", auth, isAdmin, deleteDepartment);
export default router;
