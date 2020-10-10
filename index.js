const debug = require("debug")("worker:main");
const amqpClient = require("./src/libraries/amqp/client");

amqpClient
  .init()
  .then((channel) => {
    channel.consume("tasks", amqpClient.processEvent, {
      noAck: true,
    });
  })
  .catch((error) => {
      debug(`error happened during amqp initialization: ${error}`);
  });
