const log = require("debug")("worker:database");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  logging: (message) => {
    log(message);
  },
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
});

(async () => {
  try {
    await sequelize.authenticate();
    log("connection has been established successfully.");
  } catch (error) {
    log("unable to connect to the database:", error);
    process.exit();
  }
})();

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  StoreModel: require("./store")(sequelize, Sequelize),
};
