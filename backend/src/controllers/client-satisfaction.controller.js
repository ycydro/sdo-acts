import sequelize from "../configs/sequelize.config.js";

import {
  ClientFeedback,
  Ticket,
  Service,
  Department,
  User,
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";

export const getAllClientFeedbacks = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      department_id = "", // galing buildqueryparams
    } = req.query;

    const user = req.user;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = pageNum * limitNum;

    const whereConditions = {};

    // search
    if (search && search.trim() != "") {
      const searchText = search.trim();
      //   whereConditions[Op.or] = [
      //     { ticket_code: { [Op.like]: `%${searchText}%` } },
      //     { "$service.name$": { [Op.like]: `%${searchText}%` } },
      //     { "$client.first_name$": { [Op.like]: `%${searchText}%` } },
      //     { "$client.last_name$": { [Op.like]: `%${searchText}%` } },
      //   ];
    }

    if (user.department_id) {
      whereConditions["$service.department_id$"] = user.department_id;
    } else if (department_id) {
      whereConditions["$service.department_id$"] = department_id;
    }

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: feedbacks } = await ClientFeedback.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: Ticket,
          as: "ticket",
          include: [
            {
              model: Service,
              as: "service",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "description",
                  "status",
                  "department_id",
                ],
              },
              include: [
                {
                  model: Department,
                  attributes: ["id", "name", "department_code"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],

      offset: offset,
      limit: limitNum,
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      count,
      data: feedbacks,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      message: "Client Feedbacks fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Client Feedbacks to fetch.",
      error: error.message,
    });
  }
};
