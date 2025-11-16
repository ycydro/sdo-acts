import express from "express";
import { Sequelize } from "sequelize";
import env from "../configs/env.js";

import { Service } from "../models/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
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
});

// create
router.post("/", async (req, res) => {
  try {
    const service = req.body;

    // if (!name) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Name is required.",
    //   });
    // }

    const department = await Service.create({
      ...service,
      status: service.status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully!",
      department,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the service.",
      error: err.message,
    });
  }
});

// update
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, department_code, status } = req.body;

//     const upperCasedDeptCode = department_code.toUpperCase();

//     await Department.update(
//       {
//         name,
//         description,
//         status: status || "active",
//         department_code: upperCasedDeptCode,
//       },
//       { where: { id } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Department updated successfully!",
//     });
//   } catch (err) {
//     console.error("Error updating department:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the department.",
//       error: err.message,
//     });
//   }
// });

// // delete
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Department.destroy({
//       where: {
//         id,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Department deleted successfully!",
//     });
//   } catch (err) {
//     console.error("Error deleting department:", err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the department.",
//       error: err.message,
//     });
//   }
// });

export default router;
