import express, { type Request, type Response } from "express";
import { env } from "node:process";
import "dotenv/config";
import { closeDB, runDB } from "./db/database.js";
import { type User } from "./types/iUser.js";

const app = express();
const port: number = Number(env.PORT) || 3000;
const address: string = "0.0.0.0"; // Localhost - required for Render

app.get("/", (request, response) => {
  response.send("Hello world!");
  response.status(200).send({ message: "Hello world!" });
});

app.get("/user", (req: Request, res: Response) => {
  const user: User = {
    username: "benny",
    password: "123",
    accountEnabled: true,
  };

  res.status(201).json(user);
});

app.get("/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Not a number");
    //return;
  }

  res.send({ id: id });
});

app.listen(port, address, () => {
  console.log(`Listening on port ${port}`);
});

async function startServer() {
  try {
    await runDB();

    app.listen(port, () => {
      console.log(`Listening to port ${port}`);
      console.log(`Start the app: http://localhost:${port}`);
    });

    process.on("SIGINT", async () => {
      console.log("Cleaning up...");
      await closeDB();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
