import { DataTypes } from "sequelize";
import sequelize from "../../configs/sequelize.config.js";

const TicketView = sequelize.define("ticket_view", {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ticket_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  user_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
  last_viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_comment_seen_id: {
    type: DataTypes.CHAR(36), // CHAR(36) for UUID
    allowNull: false,
  },
});

export default TicketView;
