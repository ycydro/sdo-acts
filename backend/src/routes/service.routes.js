import express from "express";
import {
  createService,
  getAllServices,
  getServicesByDepartment,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/department/:departmentId", getServicesByDepartment);
router.post("/", createService);

export default router;
