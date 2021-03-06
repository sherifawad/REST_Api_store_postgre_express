import Express from "express";
import {
	categoriesViewController,
	categoryAddController,
	categoryDeleteController,
	categoryProductsViewController,
	categoryUpdateController,
	categoryViewController
} from "../controllers/categoryController";
import validatorMiddleWare from "../middlewares/validatorMiddleWare";
import { CategoryValidator } from "../validator/CategoryValidator";

// create Router() instance
const categoryRouter = Express.Router();

categoryRouter.get("/", categoriesViewController);

categoryRouter.get(
	"/:category_id",
	CategoryValidator.checkCategoryEdit,
	validatorMiddleWare,
	categoryViewController
);

categoryRouter.get(
	"/:category_id/products",
	CategoryValidator.checkCategoryEdit,
	validatorMiddleWare,
	categoryProductsViewController
);

categoryRouter.post(
	"/",
	CategoryValidator.checkCategoryCreate,
	validatorMiddleWare,
	categoryAddController
);

categoryRouter.put(
	"/:category_id",
	CategoryValidator.checkCategoryEdit,
	validatorMiddleWare,
	categoryUpdateController
);

categoryRouter.delete(
	"/:category_id",
	CategoryValidator.checkCategoryEdit,
	validatorMiddleWare,
	categoryDeleteController
);

export default categoryRouter;
