import express from "express";
import {
  createService,
  getAllServices,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllServices);

// create
router.post("/", createService);

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
