// USER RELATED
import User from "./users/user.model.js";
import Role from "./users/role.model.js";
import Permission from "./users/permission.model.js";
import RolePermission from "./users/role_permission.model.js";

User.hasOne(Role, {
  foreignKey: "role_id",
});

Role.belongsTo(User, {
  foreignKey: "po_id",
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});

export { User, Role, Permission, RolePermission };
