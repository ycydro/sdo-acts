import { Sequelize } from "sequelize";
import { Service } from "../models/index.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [
        [
          Sequelize.literal(`
            CASE 
              WHEN classification = 'Simple' THEN 1
              WHEN classification = 'Complex' THEN 2
              ELSE 3
            END
          `),
          "ASC",
        ],
        ["createdAt", "DESC"],
      ],
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
