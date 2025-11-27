import express from "express";
import { KafkaProducer } from "../../clients/KafkaProducer";

export class SendMessagesHandler {
  constructor(
    private kafkaProducer: KafkaProducer,
    private TOPIC_NAME: string
  ) {}

  public async handle(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const { key, value } = req.body;

      if (!key) {
        res.status(400).json({ error: "Missing 'key' in request body" });
        return;
      }

      if (!value) {
        res.status(400).json({ error: "Missing 'value' in request body" });
        return;
      }

      // Convertir value a string si es un objeto
      const valueString =
        typeof value === "string" ? value : JSON.stringify(value);

      await this.kafkaProducer.connect();
      await this.kafkaProducer.sendMessage(this.TOPIC_NAME, key, valueString);
      await this.kafkaProducer.disconnect();
      res
        .status(200)
        .json({ message: "Message sent successfully", key, value });
    } catch (err: any) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: err.message || "Failed to send message" });
    }
  }
}
