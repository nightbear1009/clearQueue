#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
const { v4: uuidv4 } = require("uuid");
const queueUrl = process.env.QUEUE_URL;
const queueName = process.env.QUEUE_NAME;
const exchange = process.env.EXCHANGE;
const routeKey = process.env.ROUTE_KEY;
amqp.connect(queueUrl, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(async function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = queueName;
    var dagName = uuidv4().toString();
    var storagePath = "";

    // var msg = `msg` + uuidv4().toString()
    var msg = `{"Meta":{"Scope":"Regional","Market":"TW","ShopId":"None","Publisher":"ETL","Version":"0.1.1","ServerVersion":"0.1.1","TraceId":"abe25b80-f596-4050-b7ad-9a03daa39e91"},"Content":{"DagName":"${dagName}","EventDate":"2020-08-10T03:43:44.5721624Z","Payload":{"StoragePath":"${storagePath}","FileFormat":"tsv","CompressFormat":"gz","ExtraData":{"hello":"world","hello1":"world","hello2":"world"}}}}`;
    channel.assertQueue(queue, {
      durable: true,
    });
    console.log(msg);
    channel.publish(exchange, routeKey, Buffer.from(msg));
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 10);
});
