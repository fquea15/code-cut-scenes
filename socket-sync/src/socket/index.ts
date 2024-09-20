import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { EVENTS } from "./events";
import { ORIGIN } from "../config/env.config";

interface IMessage {
  content: string;
  username: string;
}

const setupSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ORIGIN,
      credentials: true,
    },
  });

  io.on(EVENTS.CONNECTION, (socket) => {
    console.log("a user connection");

    socket.on(EVENTS.SEND_MESSAGE, (message: IMessage) => {
      console.log("message => ", message);
      io.emit(EVENTS.RECEIVED_MESSAGE, message);
    });

    socket.on(EVENTS.DISCONNECT, () => console.log("user disconnect"));
  });
};

export default setupSocket;
