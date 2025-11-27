import { Kafka } from "kafkajs";

export class KafkaConsumer {
  private consumer;

  constructor(private client: Kafka, private groupId: string) {
    this.consumer = this.client.consumer({
      groupId: this.groupId,
      retry: {
        retries: 10,
        factor: 0.2,
        multiplier: 2,
        maxRetryTime: 30000,
      },
    });
  }

  public async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
    } catch (e) {
      // ignore
    }
  }

  public async subscribe(topic: string | RegExp): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
    } catch (err) {
      if (!(err instanceof Error) || !/connected/.test(err.message)) {
        throw err;
      }
    }
  }

  public async run<T>(
    callback: (message: TopicMessageI<T>) => void
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        callback({
          key: message.key?.toString() || "",
          value: this.parseMessageValue<T>(message.value),
        });
      },
    });
  }

  private parseMessageValue<T>(value: Buffer | null): T | string {
    if (!value) {
      throw new Error("Message value is null");
    }

    const valueString = value.toString();

    try {
      return JSON.parse(valueString);
    } catch (e) {
      return valueString;
    }
  }
}

export interface TopicMessageI<T> {
  key: string;
  value: T | string;
}
