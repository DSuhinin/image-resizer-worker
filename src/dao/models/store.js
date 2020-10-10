module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "Store",
    {
      original: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumb: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "store",
      paranoid: true,
      underscored: true,
      deletedAt: true,
      freezeTableName: true,
    }
  );
};
