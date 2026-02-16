import express from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);

//update
router.put("/:id", updateUser);
// router.get("/:id", getUserByID);

export default router;
