import express from "express";
import env from "../configs/env.js";

import { getAllRoleWithPermissions } from "../controllers/role.controller.js";

const router = express.Router();

// get all
router.get("/", getAllRoleWithPermissions);

// create
// router.post("/", createDepartment);

// update
// router.put("/:id", updateDepartment);

// delete
// router.delete("/:id", deleteDepartment);

export default router;
