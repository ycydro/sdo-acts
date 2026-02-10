import express from "express";
import env from "../configs/env.js";

import { Department } from "../models/index.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";
import { getDepartmentSatisfactionOverview } from "../controllers/client-satisfaction.controller.js";

const router = express.Router();

// get all
router.get("/", getAllDepartments);
router.get("/satisfaction-overview", getDepartmentSatisfactionOverview);

// create
router.post("/", createDepartment);

// update
router.put("/:id", updateDepartment);

// delete
router.delete("/:id", deleteDepartment);

export default router;
