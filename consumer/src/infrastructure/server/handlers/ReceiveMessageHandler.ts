import { TopicMessageI } from "../../clients/KafkaConsumer";

export class ReceiveMessageHandler {
  public handle(message: TopicMessageI<MessagePayload>): void {
    if (!message.key || !message.value) {
      throw new Error("Invalid message format");
    }

    console.log(
      `Message received ${message.key?.toString()}: ${JSON.stringify(
        message.value
      )}`
    );
  }
}

export interface MessagePayload {
  id: string;
  content: string;
}
