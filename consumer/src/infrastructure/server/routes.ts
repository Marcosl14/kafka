import express from "express";
import { KafkaClient } from "../clients/KafkaClient";
import { KafkaProducer } from "../clients/KafkaProducer";
import { KafkaConsumer } from "../clients/KafkaConsumer";
import { SendMessagesHandler } from "./handlers/SendMessagesHandler";
import {
  ReceiveMessageHandler,
  MessagePayload,
} from "./handlers/ReceiveMessageHandler";

export class Routes {
  private TOPIC_NAME = "mensajes";

  constructor(private app: express.Application) {}

  public async setupRoutes(): Promise<void> {
    const kafkaClient = new KafkaClient().start();
    const kafkaConsumer = new KafkaConsumer(kafkaClient, "consumer-group-1");
    await kafkaConsumer.subscribe(this.TOPIC_NAME);

    const sendMessageHandler = new SendMessagesHandler(
      new KafkaProducer(kafkaClient),
      this.TOPIC_NAME
    );

    const receiveMessageHandler = new ReceiveMessageHandler();

    this.app.post("/send-message", async (req, res) => {
      sendMessageHandler.handle(req, res);
    });
    await kafkaConsumer.run<MessagePayload>((message) => {
      receiveMessageHandler.handle(message);
    });
  }
}
