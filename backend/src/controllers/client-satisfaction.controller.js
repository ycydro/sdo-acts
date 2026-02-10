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
import { parseISO, startOfDay, endOfDay, subDays } from "date-fns";

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

    // only fetch completed survey
    const whereConditions = {
      completed_date: {
        [Op.ne]: null,
      },
    };

    // search
    if (search && search.trim() != "") {
      const searchText = search.trim();
      const searchNum = parseFloat(search.trim());

      whereConditions[Op.or] = [
        // by ticket code
        { "$ticket.ticket_code$": { [Op.like]: `%${searchText}%` } },

        // by service name
        { "$ticket.service.name$": { [Op.like]: `%${searchText}%` } },

        // by client first name
        { "$client.first_name$": { [Op.like]: `%${searchText}%` } },

        // by client last name
        { "$client.last_name$": { [Op.like]: `%${searchText}%` } },

        // by full name (first + last)
        Sequelize.where(
          Sequelize.fn(
            "concat",
            Sequelize.col("client.first_name"),
            " ",
            Sequelize.col("client.last_name"),
          ),
          { [Op.like]: `%${searchText}%` },
        ),

        // by overall rating (exact number)
        ...(searchNum && !isNaN(searchNum)
          ? [{ overall_rating: { [Op.eq]: searchNum } }]
          : []),

        // by overall rating as string
        { overall_rating: { [Op.like]: `%${searchText}%` } },

        // by total score (exact number)
        ...(searchNum && !isNaN(searchNum)
          ? [{ total_score: { [Op.eq]: searchNum } }]
          : []),

        // by total score as string
        { total_score: { [Op.like]: `%${searchText}%` } },
      ];
    }

    if (user.department_id) {
      whereConditions["$ticket.service.department_id$"] = user.department_id;
    } else if (department_id) {
      whereConditions["$ticket.service.department_id$"] = department_id;
    }

    console.log("🔍 Sequelize where conditions:", whereConditions);

    const { count, rows: feedbacks } =
      await ClientSurveyResponse.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: "client",
            required: true,
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: Ticket,
            required: true,
            as: "ticket",
            include: [
              {
                model: Service,
                required: true,
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
                    required: true,
                    attributes: ["id", "name", "department_code"],
                  },
                ],
              },
            ],
          },
          {
            model: ClientSurveyDimensionRating,
            as: "dimensionRatings",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
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

export const getSQDsWithRatings = async (req, res) => {
  try {
    const { departmentID = "" } = req.query;
    const user = req.user;

    // where clause for dimensions
    const dimensionWhere = { is_active: true };

    // where clause for department_id of service
    const targetDepartmentId = user.department_id || departmentID;
    const serviceWhere = targetDepartmentId
      ? { department_id: targetDepartmentId }
      : {};

    // include clause for ratings with department filtering
    const ratingInclude = {
      model: ClientSurveyResponse,
      as: "response",
      where: { status: "completed" },
      required: true,
      attributes: [],
      include: [
        {
          model: Ticket,
          as: "ticket",
          required: true,
          attributes: [],
          include: [
            {
              model: Service,
              as: "service",
              required: true,
              attributes: [],
              where: serviceWhere,
            },
          ],
        },
      ],
    };

    // get all active dimensions
    const dimensions = await ServiceQualityDimension.findAll({
      where: dimensionWhere,
      order: [["dimension_code", "ASC"]],
    });

    // get average ratings and response counts for each dimension
    // now filtered by user department if staff si user (may department_id)
    const dimensionRatings = await ClientSurveyDimensionRating.findAll({
      attributes: [
        "dimension_id",
        [sequelize.fn("AVG", sequelize.col("rating_value")), "average_rating"],
        [
          sequelize.fn("COUNT", sequelize.col("rating_value")),
          "response_count",
        ],
      ],
      include: [ratingInclude],
      group: ["dimension_id"],
      raw: true,
    });

    const dimensionsWithRatings = dimensions.map((dimension) => {
      const dimensionData = dimension.toJSON();
      const ratingData = dimensionRatings.find(
        (r) => r.dimension_id === dimension.dimension_id,
      );

      return {
        ...dimensionData,
        average_rating: ratingData
          ? parseFloat(ratingData.average_rating).toFixed(1)
          : 0,
        response_count: ratingData ? parseInt(ratingData.response_count) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: dimensionsWithRatings,
      message: "SQDs with ratings fetched successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "SQDs with ratings failed to fetch.",
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

export const getUnansweredSurvey = async (req, res) => {
  try {
    const user = req.user;

    // find the latest resolved ticket with pending survey
    const latestResolvedTicket = await Ticket.findOne({
      where: {
        client_id: user.id,
        status: "Resolved",
      },
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: Service,
          as: "service",
          include: [
            {
              model: Department,
              attributes: ["id", "name", "department_code"],
            },
          ],
        },
        {
          model: ClientSurveyResponse,
          as: "surveyReponse",
          required: false,
          where: {
            status: "Pending",
            completed_date: null,
          },
        },
      ],
    });

    if (!latestResolvedTicket) {
      return res.json({
        hasUnansweredSurvey: false,
        survey: null,
        ticket: null,
      });
    }

    const pendingSurvey = await ClientSurveyResponse.findOne({
      where: {
        ticket_id: latestResolvedTicket.id,
        status: "Pending",
        completed_date: null,
      },
    });

    if (pendingSurvey) {
      return res.json({
        hasUnansweredSurvey: true,
        survey: pendingSurvey,
        ticket: latestResolvedTicket,
        message:
          "Please complete the survey for your previous ticket before requesting a new service.",
      });
    }

    return res.json({
      hasUnansweredSurvey: false,
      survey: null,
      ticket: null,
    });
  } catch (error) {
    console.error("Error checking unanswered survey:", error);
    res.status(500).json({ error: "Failed to check survey status" });
  }
};

export const submitSurvey = async (req, res) => {
  const { ticket_id, client_id, ratings, comment } = req.body;

  if (!ticket_id || !client_id || !ratings || !Array.isArray(ratings)) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: ticket_id, client_id, and ratings array are required",
    });
  }

  if (ratings.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one rating is required",
    });
  }

  for (const rating of ratings) {
    if (!rating.dimension_id || !rating.rating) {
      return res.status(400).json({
        success: false,
        message: "Each rating must have dimension_id and rating",
      });
    }
    if (rating.rating < 1 || rating.rating > 5) {
      return res.status(400).json({
        success: false,
        message: `Rating for dimension ${rating.dimension_id} must be between 1-5`,
      });
    }
  }

  const transaction = await sequelize.transaction();

  try {
    // check if survey already exists for this ticket
    const existingSurvey = await ClientSurveyResponse.findOne({
      where: { ticket_id, client_id },
      transaction,
    });

    // if (existingSurvey) {
    //   await transaction.rollback();
    //   return res.status(400).json({
    //     success: false,
    //     message: "Survey already submitted for this ticket",
    //   });
    // }

    // get active dimensions to validate
    const activeDimensions = await ServiceQualityDimension.findAll({
      where: { is_active: true },
      attributes: ["dimension_id"],
      transaction,
    });

    const activeDimensionIds = activeDimensions.map((d) => d.dimension_id);

    // validate submitted dimensions are active
    for (const rating of ratings) {
      if (!activeDimensionIds.includes(rating.dimension_id)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Dimension ${rating.dimension_id} is not active or doesn't exist`,
        });
      }
    }

    // create dimension ratings
    const dimensionRatings = ratings.map((rating) => ({
      survey_response_id: existingSurvey.survey_response_id,
      dimension_id: rating.dimension_id,
      rating_value: rating.rating,
    }));

    await ClientSurveyDimensionRating.bulkCreate(dimensionRatings, {
      transaction,
    });

    // calculate scores
    const scores = await calculateSurveyScores(
      existingSurvey.survey_response_id,
      transaction,
    );

    // update survey with calculated scores
    await existingSurvey.update(
      {
        status: "Completed",
        overall_rating: scores.averageScore,
        total_score: scores.totalScore,
        completed_date: new Date(),
        comment,
      },
      { transaction },
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: {
        survey_id: existingSurvey.response_id,
        overall_rating: scores.averageScore,
        dimensions_rated: ratings.length,
        message: "Survey submitted successfully",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Survey submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit survey",
      error: error.message,
    });
  }
};

export const getDepartmentSatisfactionOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = startOfDay(parseISO(startDate));
      const end = endOfDay(parseISO(endDate));

      dateFilter = {
        createdAt: {
          [Op.between]: [start, end],
        },
      };
    } else {
      // default to past week if no dates provided
      const end = new Date();
      const start = subDays(end, 7);
      dateFilter = {
        createdAt: {
          [Op.between]: [start, end],
        },
      };
    }

    // Get all active departments
    const departments = await Department.findAll({
      where: { status: "active" },
      attributes: ["id", "name", "department_code"],
    });

    // For each department, calculate average rating and response count
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        // Get all dimension ratings for this department's completed surveys within date range
        const ratings = await ClientSurveyDimensionRating.findAll({
          attributes: [
            [
              sequelize.fn("AVG", sequelize.col("rating_value")),
              "average_rating",
            ],
            [
              sequelize.fn("COUNT", sequelize.col("rating_value")),
              "response_count",
            ],
          ],
          include: [
            {
              model: ClientSurveyResponse,
              as: "response",
              where: {
                status: "completed",
                ...dateFilter,
              },
              required: true,
              attributes: [],
              include: [
                {
                  model: Ticket,
                  as: "ticket",
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Service,
                      as: "service",
                      required: true,
                      attributes: [],
                      where: { department_id: dept.id },
                    },
                  ],
                },
              ],
            },
          ],
          raw: true,
        });

        // Get count of unique dimensions rated
        const dimensionCount = await ClientSurveyDimensionRating.count({
          distinct: true,
          col: "dimension_id",
          include: [
            {
              model: ClientSurveyResponse,
              as: "response",
              where: {
                status: "completed",
                ...dateFilter,
              },
              required: true,
              attributes: [],
              include: [
                {
                  model: Ticket,
                  as: "ticket",
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Service,
                      as: "service",
                      required: true,
                      attributes: [],
                      where: { department_id: dept.id },
                    },
                  ],
                },
              ],
            },
          ],
        });

        return {
          department_id: dept.id,
          department_name: dept.name,
          department_code: dept.department_code,
          average_rating: ratings[0]?.average_rating
            ? parseFloat(ratings[0].average_rating).toFixed(1)
            : "0.0",
          response_count: ratings[0]?.response_count
            ? parseInt(ratings[0].response_count)
            : 0,
          dimension_count: dimensionCount,
          date_range: {
            start_date: startDate,
            end_date: endDate,
          },
        };
      }),
    );

    // Filter out departments with no ratings
    const departmentsWithRatings = departmentStats.filter(
      (dept) => dept.response_count > 0,
    );

    return res.status(200).json({
      success: true,
      data: departmentsWithRatings,
      message: "Department satisfaction overview fetched successfully!",
      meta: {
        date_filter: {
          start_date: startDate,
          end_date: endDate,
          applied: !!(startDate && endDate),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching department satisfaction overview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department satisfaction overview.",
      error: error.message,
    });
  }
};

const calculateSurveyScores = async (responseId, transaction) => {
  const dimensionResponses = await ClientSurveyDimensionRating.findAll({
    where: { survey_response_id: responseId },
    include: [
      {
        model: ServiceQualityDimension,
        as: "dimension",
        attributes: ["weight"],
      },
    ],
    transaction,
  });

  let totalWeightedScore = 0;
  let totalWeight = 0;

  dimensionResponses.forEach((response) => {
    const weight = parseFloat(response.dimension.weight) || 1.0;
    totalWeightedScore += response.rating_value * weight;
    totalWeight += weight;
  });

  const averageScore = totalWeightedScore / totalWeight;
  const totalScore = dimensionResponses.reduce(
    (sum, r) => sum + r.rating_value,
    0,
  );

  return { averageScore, totalScore };
};
