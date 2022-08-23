/** @format */

import api from "../../../utils/api";
import { notificationService } from "../constant";

import { Stomp, Client } from "@stomp/stompjs";

const basePath = `${notificationService}`;
export const connectSocket = () => {
  let ws;
  let disabled = false;

  const client = new Client({
    brokerURL:
      "wss://localhost:3000/api/v2/message-broker-services/socket",
    connectHeaders: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdW1teWthbWFkIiwiZ3JvdXBfcm9sZSI6Im1hZHJhc2FoIiwia29kZV9yb2xlIjoia2Z9.ycCDyXAcB4QQe6D7faLucRrOrFO5jwsOo3Ktm2MLUdc",
    },
    debug: (str) => {
      // console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: (frame) => {
      // console.log("websocket -> connected");
      client.subscribe("/message", (message) => {
        if (message.body) {
          console.log(JSON.stringify(message.body));
          const data: any = JSON.parse(message.body);
          console.log("from : " + data.from);
          // this.msg.push(message.body);
        } else {
          console.log(JSON.stringify(message.body));
        }
      });
    },
    onStompError: (frame) => {
      console.log("websocket -> error");
      console.error(frame);
      console.log(
        "Broker reported error: " + frame.headers["message".toString()],
      );
      console.log("Additional details: " + frame.body);
    },
  });
  client.activate();
  return client;
};

export const getNotification = async () => {
  try {
    // console.log(basePath);
    const response = await api.get(`${basePath}/notification`, {
      params: {
        // page: 1,
        // size: 5,
        notificationStatus: "NOT_READ",
        notificationCategory: "APPROVAL",
      },
    });
    console.log(response);
    localStorage.setItem("notification", JSON.stringify(response.data.return));
    return response.data.return;
  } catch (error) {
    console.log(error);
    // if (error.response) throw error.response;
    // else throw error;
  }
};
