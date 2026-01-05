import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const ClientSurveyResponse = sequelize.define("client_survey_response", {
  survey_response_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  client_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  ticket_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  survey_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completed_date: DataTypes.DATE,
  status: {
    type: DataTypes.CHAR,
  },
  overall_rating: {
    // Calculated average
    type: DataTypes.DECIMAL(5, 2),
    validate: { min: 1, max: 5 },
  },
  total_score: {
    // Sum of all dimension ratings
    type: DataTypes.DECIMAL(5, 2),
  },
  comment: DataTypes.TEXT,
});

export default ClientSurveyResponse;
