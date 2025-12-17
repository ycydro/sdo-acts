import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const ClientSurveyDimensionRating = sequelize.define(
  "client_survey_dimension_rating",
  {
    dimension_rating_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    survey_response_id: {
      type: DataTypes.CHAR(36), // CHAR(36) for UUID
      allowNull: false,
    },
    dimension_id: {
      type: DataTypes.CHAR(36), // CHAR(36) for UUID
      allowNull: false,
    },
    rating_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  }
);

export default ClientSurveyDimensionRating;
