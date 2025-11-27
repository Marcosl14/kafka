// docker compose up --build
// docker compose logs -f consumer

import { ExpressServer } from "./infrastructure/server/server";

const server = new ExpressServer();
server.start();
