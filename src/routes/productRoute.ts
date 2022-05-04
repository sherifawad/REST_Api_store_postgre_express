import Express from "express";
import {
	productsViewController,
	productAddController,
	productDeleteController,
	productUpdateController,
	productViewController
} from "../controllers/productController";
import validatorMiddleWare from "../middlewares/validatorMiddleWare";
import {
	productCreateValidator,
	productEditValidator
} from "../validator/ProductValidator";

// create Router() instance
const productRouter = Express.Router();

productRouter.get("/", productsViewController);

productRouter.get(
	"/:product_id",
	productEditValidator,
	validatorMiddleWare,
	productViewController
);

productRouter.post(
	"/",
	productCreateValidator,
	validatorMiddleWare,
	productAddController
);

productRouter.put(
	"/:product_id",
	productEditValidator,
	validatorMiddleWare,
	productUpdateController
);

productRouter.delete(
	"/:product_id",
	productEditValidator,
	validatorMiddleWare,
	productDeleteController
);

export default productRouter;
