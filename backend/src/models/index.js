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
import TicketComment from "./tickets/comments/ticket-comment.model.js";

// CLIENT SATISFACTION RELATED
import ClientSurveyResponse from "./client-satisfaction/client-survey-response.model.js";
import ClientSurveyDimensionRating from "./client-satisfaction/client-survey-dimension-rating.model.js";
import ServiceQualityDimension from "./client-satisfaction/service-quality-dimension.model.js";
import TicketView from "./tickets/ticket-view.model.js";

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

// TICKET COMMENTS
Ticket.hasMany(TicketComment, {
  foreignKey: "ticket_id",
  as: "comments",
  onDelete: "CASCADE",
});

TicketComment.belongsTo(Ticket, {
  foreignKey: "ticket_id",
  as: "ticket",
});

User.hasMany(TicketComment, {
  foreignKey: "user_id",
  as: "comments",
});

TicketComment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User associations
User.hasMany(TicketView, {
  foreignKey: "user_id",
  as: "ticket_views",
});

Ticket.hasMany(TicketView, {
  foreignKey: "ticket_id",
  as: "views",
});

TicketComment.hasMany(TicketView, {
  foreignKey: "last_comment_seen_id",
  as: "viewed_by_users",
});

TicketView.belongsTo(User, {
  foreignKey: "user_id",
});

TicketView.belongsTo(Ticket, {
  foreignKey: "ticket_id",
});

TicketView.belongsTo(TicketComment, {
  foreignKey: "last_comment_seen_id",
  as: "last_seen_comment",
});

// CLIENT SATISFACTION
User.hasMany(ClientSurveyResponse, {
  foreignKey: "client_id",
  as: "givenResponses",
});

ClientSurveyResponse.belongsTo(User, {
  foreignKey: "client_id",
  as: "client",
});

Ticket.hasOne(ClientSurveyResponse, {
  foreignKey: "ticket_id",
  as: "surveyReponse",
});

ClientSurveyResponse.belongsTo(Ticket, {
  foreignKey: "ticket_id",
  as: "ticket",
});

ClientSurveyResponse.hasMany(ClientSurveyDimensionRating, {
  foreignKey: "survey_response_id",
  as: "dimensionRatings",
});
ClientSurveyDimensionRating.belongsTo(ClientSurveyResponse, {
  foreignKey: "survey_response_id",
  as: "response",
});

ServiceQualityDimension.hasMany(ClientSurveyDimensionRating, {
  foreignKey: "dimension_id",
  as: "ratings",
});
ClientSurveyDimensionRating.belongsTo(ServiceQualityDimension, {
  foreignKey: "dimension_id",
  as: "dimension",
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
  TicketComment,
  TicketView,

  // CLIENT SATISFACTION
  ServiceQualityDimension,
  ClientSurveyResponse,
  ClientSurveyDimensionRating,
};
