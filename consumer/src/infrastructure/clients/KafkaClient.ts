import { Kafka } from "kafkajs";

export class KafkaClient {
  private kafka: Kafka = new Kafka({
    clientId: "consumer-simple",
    brokers: ["kafka:29092"],
    connectionTimeout: 30000,
    retry: {
      initialRetryTime: 10000,
      retries: 10,
      factor: 1,
      multiplier: 1,
      maxRetryTime: 10000,
    },
  });

  public start(): Kafka {
    return this.kafka;
  }
}
