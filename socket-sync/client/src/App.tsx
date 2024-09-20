import React, { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chance from "chance";
import { HOST } from "./utils/constants";
import { EVENTS } from "./socket/events";
import { IoSend } from "react-icons/io5";

interface IMessage {
  content: string;
  username: string;
}

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const chance = new Chance();
    setUsername(chance.name());

    const newSocket = io(HOST, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on(EVENTS.CONNECTION, () => {
      console.log("server connection");
    });

    newSocket.on(EVENTS.RECEIVED_MESSAGE, (message: IMessage) => {
      setReceivedMessages((preMessages) => [...preMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && socket) {
      socket.emit(EVENTS.SEND_MESSAGE, { content: message, username });
    }
    setMessage("");
  }, [message, socket]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const renderMessage = (messages: IMessage[]) => (
    <div className="px-1">
      {messages.map((message, index) => (
        <div
          className={`flex w-full p-2 ${username === message.username && "justify-end"}`}
          key={index}
        >
          <div
            className={`w-max max-w-[50%] rounded-t-lg border px-3 py-2 text-gray-200 ${username === message.username ? "rounded-bl-lg border-violet-700 bg-gray-800 bg-opacity-90" : "rounded-br-lg border-violet-600 bg-gray-700 bg-opacity-70"}`}
          >
            {message.content}
            {username !== message.username && (
              <p className="text-xs text-gray-400">{message.username}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900">
      <div className="flex h-[80vh] w-[80vw] flex-col rounded-lg border border-violet-700 bg-gray-800">
        <div className="py-2 text-center text-lg text-gray-200 shadow-md shadow-gray-500">
          #{username}
        </div>
        <div className="flex h-full flex-col-reverse overflow-y-auto text-white no-scroll">
          {renderMessage(receivedMessages)}
        </div>
        <div className="flex gap-2 px-4 py-3 shadow-inner shadow-gray-500">
          <input
            value={message}
            type="text"
            className="w-full rounded-md bg-gray-700 px-3 py-2 text-gray-200 outline-none"
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="rounded-md bg-gradient-to-r from-violet-600 to-violet-700 px-3 hover:bg-gradient-to-br"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <IoSend className="text-lg text-gray-200" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default App;
