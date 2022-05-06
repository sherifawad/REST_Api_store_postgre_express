import express, { Request, Response } from "express";
import authenticationMiddleware from "../middlewares/authenticaionMiddleware";
import categoryRouter from "./categoryRoute";
import orderRouter from "./orderRoute";
import productRouter from "./productRoute";
import userRouter from "./userRoute";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response): void => {
	res.status(200).json("Main Api");
});

routes.use("/category", authenticationMiddleware, categoryRouter);
routes.use("/product", authenticationMiddleware, productRouter);
routes.use("/user", userRouter);
routes.use("/order", authenticationMiddleware, orderRouter);

export default routes;
