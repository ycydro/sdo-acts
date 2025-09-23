import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const Role = sequelize.define("role", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.CHAR,
  },
});

export default Role;
