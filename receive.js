const { GoogleAuth } = require("google-auth-library");
const log = require("./log");

const auth = new GoogleAuth();

const queueUrl = process.env.QUEUE_URL_DES;
const queueName = process.env.QUEUE_NAME_DES;
const exchange = process.env.EXCHANGE;
const routeKey = process.env.ROUTE_KEY;
const LOG_TAG = "receive.js";
log.info(
  LOG_TAG,
  `queueName:${queueName} exchange:${exchange} routeKey:${routeKey}`,
  ""
);

var amqp = require("amqplib/callback_api");

amqp.connect(queueUrl, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queueName, {}, function (error2, q) {
      if (error2) {
        throw error2;
      }
      log.info(
        LOG_TAG,
        `queueName:${queueName} exchange:${exchange} routeKey:${routeKey}`
      );

      channel.consume(
        queueName,
        async function (msg) {
          var payload = `${msg.content.toString()}`;
          log.info(LOG_TAG, `Received`, { ...JSON.parse(payload) });
        },
        {
          noAck: true,
        }
      );
    });
  });
});
