import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const Department = sequelize.define("department", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.CHAR,
  },
  description: {
    type: DataTypes.STRING,
  },
  department_head: {
    type: DataTypes.CHAR,
  },
  status: {
    type: DataTypes.CHAR,
  },
});

export default Department;
