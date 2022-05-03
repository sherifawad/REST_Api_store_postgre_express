import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validatorMiddleWare = (
	req: Request,
	res: Response,
	next: NextFunction
): void | Response => {
	// validation errors array
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// if there are errors show first error
		console.log(
			"🚀 ~ file: validatorMiddleWare.ts ~ line 14 ~ errors.array()[0]",
			errors.array()[0]
		);
		return res.status(400).json(errors.array()[0]);
		// return res.status(400).json({ errors: errors.array() });
	}
	// pass the request to its next stage
	return next();
};

export default validatorMiddleWare;
