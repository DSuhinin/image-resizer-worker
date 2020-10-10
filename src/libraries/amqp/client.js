const debug = require("debug")("worker:amqp");
const amqp = require("amqplib");
const eventHandlers = require("./events");

async function init() {
  const connection = await amqp.connect(process.env.AMQP_HOST);
  if(!connection) {
    debug(1);
    throw new Error("impossible to create AMQP connection");
  }
  const channel = await connection.createChannel();
  if(!channel) {
    debug(1);
    throw new Error("impossible to create AMQP channel");
  }
  await channel.assertQueue("tasks", {
    durable: false,
  });

  return channel;
}

function processEvent(message) {
  const data = JSON.parse(message.content.toString());
  debug(`incoming request for item: ${data.id}, action: ${data.action}`);
  switch (data.action) {
    case "resize":
      eventHandlers.resizeEventHandler(data);
      break;
    case "delete":
      eventHandlers.deleteEventHandler(data);
      break;
  }
}

module.exports = {
  init,
  processEvent,
};
