import express from "express";
const router = express.Router();
import {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
} from "../Controllers/department.controller.js";
import { isAdmin } from "../Middlewares/auth.middleware.js";

router.post("/", isAdmin, createDepartment);

router.get("/", getAllDepartments);

router.delete("/:id", isAdmin, deleteDepartment);
export default router;
