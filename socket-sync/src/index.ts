import { createServer } from "node:http";
import app from "./app";
import { PORT } from "./config/env.config";
import setupSocket from "./socket";

const port = PORT || (3000 as number);

async function main() {
  const server = createServer(app);
  console.log(`Sever is runnig on http://localhost:${port}`);

  setupSocket(server);

  server.listen(port);
}

main();
