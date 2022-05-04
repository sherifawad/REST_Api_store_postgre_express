import express, { Request, Response } from "express";
import categoryRouter from "./categoryRoute";
import productRouter from "./productRoute";
import userRouter from "./userRoute";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response): void => {
	res.status(200).json("Main Api");
});

routes.use("/category", categoryRouter);
routes.use("/product", productRouter);
routes.use("/user", userRouter);

export default routes;
