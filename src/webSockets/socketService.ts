import { IMessage, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SocketMessageModel } from "./SocketMessageModel";

class WebSocketService {
  socketUrl: string;
  socket: any;
  stompClient: any;
  reconnectInterval: number;
  maxRetries: number;
  retryCount: number;
  subscriptions = new Map<string, any>();
  pendingSubscriptions: { topic: string; callback: (message: any) => void }[] =
    [];

  constructor() {
    this.socketUrl = "http://localhost:1000/ws";
    this.socket = null;
    this.stompClient = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.maxRetries = 10;
    this.retryCount = 0;
  }

  connect(_callback?: () => void) {
    console.log("Attempting WebSocket connection...");

    this.socket = new SockJS(this.socketUrl);
    this.stompClient = Stomp.over(this.socket);

    // Disable logging unless needed
    // this.stompClient.debug = null;

    this.stompClient.connect(
      {},
      () => {
        console.log("Connected to WebSocket");
        this.retryCount = 0;

        // Process any pending subscriptions
        this.pendingSubscriptions.forEach(({ topic, callback }) =>
          this.subscribe(topic, callback)
        );
        this.pendingSubscriptions = []; // Clear after processing

        if (_callback) _callback();
      },
      (error: any) => {
        console.error("WebSocket error: ", error);
        this.handleReconnect(_callback);
      }
    );
  }

  handleReconnect(_callback?: () => void) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;

      console.log(
        `Reconnecting attempt ${this.retryCount} in ${
          this.reconnectInterval / 1000
        } seconds...`
      );

      setTimeout(() => {
        this.connect(_callback);
      }, this.reconnectInterval);
    } else {
      console.error("Max reconnection attempts reached.");
    }
  }

  sendMessage(destination: string, message: SocketMessageModel) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected. Message not sent.");
    }
  }

  subscribe(topic: string, callback: (message: SocketMessageModel) => void) {
    if (this.stompClient && this.stompClient.connected) {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.stompClient.subscribe(
          topic,
          (message: IMessage) => {
            // console.log(`Raw message received on topic ${topic}:`, message);

            if (!message || !message.body) {
              console.error(
                `Received an empty or invalid message on topic ${topic}:`,
                message
              );
              return; // Prevent JSON.parse(undefined) error
            }

            try {
              const parsedMessage = JSON.parse(message.body);

              // Check if 'content' needs additional parsing
              if (typeof parsedMessage.content === "string") {
                try {
                  parsedMessage.content = JSON.parse(parsedMessage.content);
                } catch (innerError) {
                  console.warn(
                    "Content is not valid JSON:",
                    parsedMessage.content
                  );
                }
              }

              callback(parsedMessage);
            } catch (error) {
              console.error(
                `Failed to parse message from topic ${topic}:`,
                error,
                message.body
              );
            }
          }
        );

        // Store the subscription
        this.subscriptions.set(topic, subscription);
        console.log(`Subscribed to topic: ${topic}`);
      }
    } else {
      console.warn(
        `WebSocket not connected. Queuing subscription for: ${topic}`
      );
      this.pendingSubscriptions.push({ topic, callback });
    }
  }

  unsubscribe(topic: string) {
    if (this.subscriptions.has(topic)) {
      const subscription = this.subscriptions.get(topic);
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    }
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket.");
      });
    }
  }
}

// Export an instance for use
export const webSocketService = new WebSocketService();
