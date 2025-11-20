import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },

  mobile_number: {
    type: DataTypes.BIGINT,
  },
  sex: {
    type: DataTypes.CHAR,
  },
  role_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },

  // FOR CLIENT AND ADMINS, NULLABLE DEPT ID
  department_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: true,
  },
});

export default User;
