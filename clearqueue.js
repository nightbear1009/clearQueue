const log = require("./log");

var fs = require("fs");

const queueUrl = process.env.QUEUE_URL;
const queueName = process.env.QUEUE_NAME;
const exchange = process.env.EXCHANGE;
const routeKey = process.env.ROUTE_KEY;

const queueUrlDes = process.env.QUEUE_URL_DES;
const queueNameDes = process.env.QUEUE_NAME_DES;

var amqp_source = require("amqplib/callback_api");
var amqp_destination = require("amqplib/callback_api");
var LOG_TAG = "clearQueue";
fs.appendFile("healthy", "Hello content!", function (err) {
  if (err) throw err;
  console.log("Saved!");
});

async function request(payload) {
  amqp_destination.connect(queueUrlDes, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(async function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = queueName;

      channel.assertQueue(queue, {
        durable: true,
      });
      try {
        log.info(LOG_TAG, "sendRequest", { ...JSON.parse(payload) });
      } catch (e) {
        log.info(LOG_TAG, "sendRequest", { payload });
      }

      channel.sendToQueue(queueNameDes, Buffer.from(payload));
    });
  });
}

amqp_source.connect(queueUrl, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    log.info(
      LOG_TAG,
      " [*] Waiting for messages in %s. To exit press CTRL+C",
      queueName
    );
    channel.assertQueue(queueName, {}, function (error2, q) {
      if (error2) {
        throw error2;
      }
      log.info(
        LOG_TAG,
        `queueName:${queueName} exchange:${exchange} routeKey:${routeKey}`
      );
      channel.bindQueue(queueName, exchange, routeKey);

      channel.consume(
        queueName,
        async function (msg) {
          try {
            log.info(LOG_TAG, "Received", { ...JSON.parse(msg.content.toString()) });
          } catch (e) {
            log.info(LOG_TAG, "Received", `${msg.content.toString()}`);
          }
          await request(msg.content.toString()).catch((err) => {
            log.error(LOG_TAG, err.message);
          });
        },
        {
          noAck: true,
        }
      );
    });
  });
});
