import express, { Request, Response } from "express";
import { POIRouter } from "./controllers/poi.controller";
import { AuthRouter } from "./controllers/auth.controller";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});