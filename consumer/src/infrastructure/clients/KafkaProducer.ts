import { Kafka, Producer } from "kafkajs";

export class KafkaProducer {
  private producer: Producer;

  constructor(private client: Kafka) {
    this.producer = this.client.producer({
      allowAutoTopicCreation: true,
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (err) {
      if (!(err instanceof Error) || !/connected/.test(err.message)) {
        throw err;
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
    } catch (e) {
      // ignore
    }
  }

  public async sendMessage(
    topic: string,
    messageKey: string,
    messageValue: string
  ): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ key: messageKey, value: messageValue }],
    });
    return;
  }
}
