import sequelize from "../configs/sequelize.config.js";

import {
  ClientSurveyResponse,
  ClientSurveyDimensionRating,
  ServiceQualityDimension,
  Ticket,
  Service,
  Department,
  User,
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";

export const getAllClientSurveyResponses = async (req, res) => {
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

    const { count, rows: feedbacks } =
      await ClientSurveyResponse.findAndCountAll({
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
          {
            model: ClientSurveyDimensionRating,
            as: "dimensionRatings",
            include: [
              {
                model: ServiceQualityDimension,
                as: "dimension",
                attributes: ["dimension_id", "dimension_name", "scenario"],
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
      message: "Client Survey Responses fetched successfully!",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Client Survey Responses to fetch.",
      error: error.message,
    });
  }
};

export const getAllSQDs = async (req, res) => {
  try {
    const sqds = await ServiceQualityDimension.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: sqds,
      message: "SQDs fetched successfuly!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "SQDs failed to fetch.",
    });
  }
};

export const getClientSurveyResponseByID = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const survey = await ClientSurveyResponse.findOne({
      where: { ticket_id },
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
        {
          model: ClientSurveyDimensionRating,
          as: "dimensionRatings",
          include: [
            {
              model: ServiceQualityDimension,
              as: "dimension",
              attributes: ["dimension_id", "dimension_name", "scenario"],
            },
          ],
        },
      ],
      raw: false,
    });

    if (!survey) {
      return res.json({
        ticket_id,
        survey: null,
      });
    }

    const plainSurvey = survey.get({ plain: true });

    return res.status(200).json({
      success: true,
      ticket_id,
      survey: {
        ...plainSurvey,
        answered: Boolean(plainSurvey.completed_date),
        answered_at: plainSurvey.completed_date,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Client Survey Response failed to fetch.",
    });
  }
};
