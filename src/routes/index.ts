import express, { Request, Response } from "express";
import categoryRouter from "./categoryRoute";
import productRouter from "./productRoute";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response): void => {
	res.status(200).json("Main Api");
});

routes.use("/category", categoryRouter);
routes.use("/product", productRouter);

export default routes;
