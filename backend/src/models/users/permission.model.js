import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const Permission = sequelize.define("permission", {
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

export default Permission;
