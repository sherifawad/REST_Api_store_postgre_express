import Express from "express";
import {
	ordersViewController,
	orderAddController,
	orderDeleteController,
	orderUpdateController,
	orderViewController
} from "../controllers/orderController";
import validatorMiddleWare from "../middlewares/validatorMiddleWare";
import {
	orderCreateValidator,
	orderEditValidator
} from "../validator/OrderValidator";

// create Router() instance
const orderRouter = Express.Router();

orderRouter.get("/", ordersViewController);

orderRouter.get(
	"/:order_id",
	orderEditValidator,
	validatorMiddleWare,
	orderViewController
);

orderRouter.post(
	"/",
	orderCreateValidator,
	validatorMiddleWare,
	orderAddController
);

orderRouter.put(
	"/:order_id",
	orderEditValidator,
	validatorMiddleWare,
	orderUpdateController
);

orderRouter.delete(
	"/:order_id",
	orderEditValidator,
	validatorMiddleWare,
	orderDeleteController
);

export default orderRouter;
