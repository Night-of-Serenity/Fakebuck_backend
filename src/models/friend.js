module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM("PENDING", "ACCEPTED"),
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  Friend.associate = (models) => {
    Friend.belongsTo(models.User, {
      as: "Requester",
      foreignKey: {
        name: "requesterId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    Friend.belongsTo(models.User, {
      as: "Receiver",
      foreignKey: {
        name: "receiverId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
  };

  return Friend;
};
