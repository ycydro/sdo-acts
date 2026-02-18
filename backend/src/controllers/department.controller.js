import { Op } from "sequelize";
import env from "../configs/env.js";
import sequelize from "../configs/sequelize.config.js";

import { Department } from "../models/index.js";

export const getAllDepartments = async (req, res) => {
  const { search = "" } = req.query;

  const whereConditions = {};

  if (search && search.trim() !== "") {
    const searchText = search.trim();

    whereConditions[Op.or] = [
      {
        name: { [Op.like]: `%${searchText}%` },
      },
      {
        department_code: { [Op.like]: `%${searchText}%` },
      },
    ];
  }

  try {
    const departments = await Department.findAll({
      where: whereConditions,
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
};

export const createDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, status, department_code } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const upperCasedDeptCode = department_code.toUpperCase();

    const existingDeptCode = await Department.findOne({
      where: {
        department_code: upperCasedDeptCode,
      },
    });

    if (existingDeptCode) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "Department Code already exists!",
      });
    }

    const department = await Department.create(
      {
        name,
        description,
        status: status || "active",
        department_code: upperCasedDeptCode,
      },
      { transaction },
    );

    await transaction.commit();
    res.status(201).json({
      success: true,
      message: "Department created successfully!",
      department,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the department.",
      error: err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      { where: { id }, transaction },
    );

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Department updated successfully!",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the department.",
      error: err.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    await Department.destroy({
      where: {
        id,
      },
      transaction,
    });
    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Department deleted successfully!",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error deleting department:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the department.",
      error: err.message,
    });
  }
};
