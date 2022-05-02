import Express from "express";
import { getImage } from "../controllers/images";
import validatorMiddleWare from "../middlewares/validatorMiddleWare";
import { ImagesValidator } from "../validator/ImagesValidator";

// create Router() instance
const imagesRouter = Express.Router();
// image get route
imagesRouter.get(
	// route
	"/",
	// express validation rules
	ImagesValidator.checkReadImage,
	// middleware validation
	validatorMiddleWare,
	// get image controller
	getImage
);

export default imagesRouter;
