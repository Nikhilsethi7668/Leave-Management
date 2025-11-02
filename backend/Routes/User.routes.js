import express from "express";
const router = express.Router();
import {
  signup,
  login,
  approveUser,
  deactivateUser,
  logout,
  me,
  getAllUsers,
} from "../Controllers/auth.controller.js";
import { auth, isAdmin } from "../Middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, me);
router.patch("/approve/:userId", auth, isAdmin, approveUser);
router.patch("/deactivate/:userId", auth, isAdmin, deactivateUser);

router.get("/getAllUsers", auth, isAdmin, getAllUsers);
export default router;
