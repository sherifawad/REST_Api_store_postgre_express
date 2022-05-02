import { body, param } from "express-validator";

// route image validator
export const CategoryValidator = {
	// validate get with query parameters
	checkCategoryCreate: [
		body("category_name")
			// if only white space throw error
			.notEmpty({ ignore_whitespace: true })
			.withMessage("category name is empty or white space")
	],
	checkCategoryEdit: [
		param("category_id")
			.not()
			.isEmpty({ ignore_whitespace: true })
			.trim()
			.escape()
			.withMessage("there is no category_id"),

		body("category_name")
			.optional()
			.notEmpty({ ignore_whitespace: true })
			.withMessage("Invalid category name"),

		body("category_description")
			.optional()
			.notEmpty({ ignore_whitespace: true })
			.withMessage("Invalid category description")
	]
};
