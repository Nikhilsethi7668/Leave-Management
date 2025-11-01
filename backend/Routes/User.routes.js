import express from "express";
const router = express.Router();
import {
  signup,
  login,
  approveUser,
  deactivateUser,
  logout,
} from "../Controllers/auth.controller.js";
import { isAdmin } from "../Middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/approve/:userId", isAdmin, approveUser);
router.patch("/deactivate/:userId", isAdmin, deactivateUser);

export default router;
