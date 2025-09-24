import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    role_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
  },
  {
    tableName: "roles_permissions",
  }
);

export default RolePermission;
