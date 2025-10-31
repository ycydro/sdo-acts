import express from "express";
import env from "../configs/env.js";

import { Department } from "../models/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: departments,
      message: "Departments fetched successfuly!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Department failed to fetch.",
    });
  }
});

// create
router.post("/", async (req, res) => {
  try {
    const { name, description, status, department_code } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const upperCasedDeptCode = department_code.toUpperCase();

    const department = await Department.create({
      name,
      description,
      status: status || "active",
      department_code: upperCasedDeptCode,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully!",
      department,
    });
  } catch (err) {
    console.error("Error creating department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the department.",
      error: err.message,
    });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, department_code, status } = req.body;

    const upperCasedDeptCode = department_code.toUpperCase();

    await Department.update(
      {
        name,
        description,
        status: status || "active",
        department_code: upperCasedDeptCode,
      },
      { where: { id } }
    );

    res.status(200).json({
      success: true,
      message: "Department updated successfully!",
    });
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the department.",
      error: err.message,
    });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Department.destroy({
      where: {
        id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Department deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the department.",
      error: err.message,
    });
  }
});

export default router;
