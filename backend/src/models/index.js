// USER RELATED
import User from "./users/user.model.js";
import Role from "./users/role.model.js";
import Permission from "./users/permission.model.js";
import RolePermission from "./users/role_permission.model.js";

// DEPARTMENT RELATED
import Department from "./departments/department.model.js";
import Service from "./departments/service.model.js";

// USER
User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
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

// DEPARTMENT
Department.hasMany(Service, {
  foreignKey: "department_id",
});

Service.belongsTo(Department, {
  foreignKey: "department_id",
});

export {
  // USER
  User,
  Role,
  Permission,
  RolePermission,

  // DEPARTMENT
  Department,
  Service,
};
