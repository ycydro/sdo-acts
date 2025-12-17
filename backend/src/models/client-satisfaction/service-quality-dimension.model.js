import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const ServiceQualityDimension = sequelize.define("service_quality_dimension", {
  dimension_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  dimension_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  dimension_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  scenario: {
    type: DataTypes.TEXT,
  },
  weight: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default ServiceQualityDimension;
