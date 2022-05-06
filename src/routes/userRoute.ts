import Express from "express";
import {
	usersViewController,
	userAddController,
	userDeleteController,
	userUpdateController,
	userViewController
} from "../controllers/userController";
import authenticationMiddleware from "../middlewares/authenticaionMiddleware";
import validatorMiddleWare from "../middlewares/validatorMiddleWare";
import { UserValidator } from "../validator/UserValidator";

// create Router() instance
const userRouter = Express.Router();

userRouter.get("/", usersViewController);

userRouter.get(
	"/:user_id",
	authenticationMiddleware,
	UserValidator.checkUserEdit,
	validatorMiddleWare,
	userViewController
);

userRouter.post(
	"/",
	UserValidator.checkUserCreate,
	validatorMiddleWare,
	userAddController
);

userRouter.put(
	"/:user_id",
	authenticationMiddleware,
	UserValidator.checkUserEdit,
	validatorMiddleWare,
	userUpdateController
);

userRouter.delete(
	"/:user_id",
	authenticationMiddleware,
	UserValidator.checkUserEdit,
	validatorMiddleWare,
	userDeleteController
);

export default userRouter;
