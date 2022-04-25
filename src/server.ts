import express, { Express, Response, Request } from "express";

const app: Express = express();
let count = 0;
app.get("/api/", (_req: Request, res: Response) => {
	count++;
	res.send(`link visited ${count} time`);
});

app.listen(process.env.PORT, () =>
	console.log("server started at http://localhost:4000")
);
