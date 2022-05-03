import express, { Request, Response } from "express";
import categoryRouter from "./categoryRoute";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response): void => {
	res.status(200).json("Main Api");
});

routes.use("/category", categoryRouter);

export default routes;
