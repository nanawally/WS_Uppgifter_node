import express, { type Request, type Response } from "express";
import "dotenv/config"; // oneliner for configuration
import { closeDB, runDB } from "./db/database.ts";

const app = express();
const port: number = 3000;

app.get("/", (request, response) => {
  response.send("Hello world!");
  response.status(200).send({ message: "Hello world!" });
});

/*app.get("/:id", (req: Request, res: Response) => {
const id = req.params.id
res.send({ id: id })
})*/

app.get("/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id); // CASTING
  if (isNaN(id)) {
    res.status(400).send("Not a number");
    return;
  }
  res.send({ id: id });
});

/*app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});*/

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
