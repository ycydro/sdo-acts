// USER RELATED
import User from "./users/user.model.js";
import Role from "./users/role.model.js";
import Permission from "./users/permission.model.js";
import RolePermission from "./users/role_permission.model.js";

// DEPARTMENT RELATED
import Department from "./departments/department.model.js";
import Service from "./departments/service.model.js";

// TICKET RELATED
import Ticket from "./tickets/ticket.model.js";
import TicketCounter from "./tickets/ticket-counter.model.js";
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

User.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

Department.hasMany(User, {
  foreignKey: "department_id",
  as: "users",
});

// DEPARTMENT
Department.hasMany(Service, {
  foreignKey: "department_id",
});

Service.belongsTo(Department, {
  foreignKey: "department_id",
});

// TICKET RELATED
Department.hasOne(TicketCounter, {
  foreignKey: "department_id",
  as: "ticketCounter",
});

TicketCounter.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

Service.hasMany(Ticket, {
  foreignKey: "service_id",
  as: "tickets",
});

Ticket.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

User.hasMany(Ticket, {
  foreignKey: "client_id",
  as: "clientTickets",
});

Ticket.belongsTo(User, {
  foreignKey: "client_id",
  as: "client",
});

User.hasMany(Ticket, {
  foreignKey: "assignee_id",
  as: "assignedTickets",
});

Ticket.belongsTo(User, {
  foreignKey: "assignee_id",
  as: "assignee",
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

  // TICKET
  Ticket,
  TicketCounter,
};
