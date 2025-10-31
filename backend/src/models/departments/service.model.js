import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const Service = sequelize.define("service", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  processing_time_in_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classification: {
    type: DataTypes.CHAR,
  },

  status: {
    type: DataTypes.CHAR,
  },
  department_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
});

export default Service;
