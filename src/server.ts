import bodyParser from "body-parser";
import express, { Express } from "express";
import routes from "./routes";

export const app: Express = express();
const PORT: string = process.env.PORT ?? "4000";

app.use(bodyParser.json());
app.use("/api", routes);

app.listen(PORT, () =>
	console.log(`Server started at http://localhost:${PORT}`)
);
