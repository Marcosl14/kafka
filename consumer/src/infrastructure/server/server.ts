import express from "express";
import { Routes } from "./routes";

export class ExpressServer {
  private app = express();
  private port: number = 3000;

  async start() {
    this.app.use(express.json());

    const routes = new Routes(this.app);
    await routes.setupRoutes();

    this.app.listen(this.port, () => {
      console.log(`Express server listening on port ${this.port}`);
    });
  }
}
