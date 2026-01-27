import { DataTypes } from "sequelize";
import sequelize from "../../../configs/sequelize.config.js";

const QueueSession = sequelize.define(
  "queue_session",
  {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    department_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true, // One active session per department
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    current_serving_ticket_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    started_by_user_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    session_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["department_id", "session_date"],
      },
    ],
  },
);

export default QueueSession;
