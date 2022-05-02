import express, { Request, Response } from "express";
import imagesRouter from "./images";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response): void => {
	res.status(200).json("Main Api");
});

routes.use("/images", imagesRouter);

export default routes;
