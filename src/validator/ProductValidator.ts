import { body, param } from "express-validator";
import { checkCategoryExist } from "../models/category";

export const productCreateValidator = [
	body("product_name")
		.exists()
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("Invalid Product name"),

	body("product_price")
		.exists()
		.isNumeric({ no_symbols: true })
		.trim()
		.escape()
		.withMessage("Invalid Product price"),

	body("product_description")
		.optional()
		.notEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("Invalid product description"),

	body("category_id")
		.optional()
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.bail()
		.custom((value: string | number) => checkCategoryExist(value))
		.withMessage("Invalid user category_id")
];

export const productEditValidator = [
	param("product_id")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("there is no product_id"),

	body("product_name")
		.optional()
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("Invalid Product name"),

	body("product_price")
		.optional()
		.isNumeric({ no_symbols: true })
		.trim()
		.escape()
		.withMessage("Invalid Product price"),

	body("product_description")
		.optional()
		.notEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("Invalid product description"),

	body("category_id")
		.optional()
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.bail()
		.custom((value: string | number) => checkCategoryExist(value))
		.withMessage("Invalid user category_id")
];
