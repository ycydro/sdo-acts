import { Op, Sequelize, where } from "sequelize";
import { Department, Service } from "../models/index.js";
import sequelize from "../configs/sequelize.config.js";

export const getAllServices = async (req, res) => {
  try {
    const {
      search = "",
      department_id = "", // galing buildqueryparams
      priority = "", // galing buildqueryparams
      classification = "", // galing buildqueryparams
    } = req.query;

    const whereConditions = {};

    if (search && search.trim() != "") {
      const searchText = search.trim();
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${searchText}%` } },
        { "$department.name$": { [Op.like]: `%${searchText}%` } },
        { "$department.department_code$": { [Op.like]: `%${searchText}%` } },
      ];
    }

    if (priority) {
      whereConditions.priority = priority;
    }

    if (classification) {
      whereConditions.classification = classification;
    }

    if (department_id) {
      whereConditions.department_id = department_id;
    }

    const services = await Service.findAll({
      where: whereConditions,
      include: [
        {
          model: Department,
          as: "department",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: services,
      message: "Services fetched successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Services failed to fetch.",
    });
  }
};

export const getServicesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const services = await Service.findAll({
      where: { department_id: departmentId },
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: services,
      message: "Services fetched successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Services failed to fetch.",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const service = req.body;

    const createdService = await Service.create({
      ...service,
      status: service.status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully!",
      createdService,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the service.",
      error: err.message,
    });
  }
};

export const updateService = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const service = req.body;

    await Service.update(
      {
        ...service,
      },
      { where: { id }, transaction },
    );

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Service updated successfully!",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating service:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the service.",
      error: err.message,
    });
  }
};
