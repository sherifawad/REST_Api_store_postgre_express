import { body, param } from "express-validator";
import { checkProductExist } from "../models/product";
import { OrderProduct } from "../typings/interface";

export const orderCreateValidator = () => [
	body("user_id")
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("there is no user_id"),
	body("order_products")
		.isArray()
		.exists()
		.withMessage("there is no products")
		.isArray({ min: 1 })
		.withMessage(`at least 1 item required`)
		.bail()
		.custom((value: OrderProduct[]): boolean =>
			value.every(
				async v =>
					v.order_product_quantity &&
					v.product_id &&
					(await checkProductExist(v.product_id))
			)
		)
		.withMessage("Not valid Products")
];

export const orderEditValidator = () => [
	param("order_id")
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("there is no order_id"),

	body("order_products")
		.optional()
		.isArray()
		.exists()
		.withMessage("there is no products")
		.isArray({ min: 1 })
		.withMessage(`at least 1 item required`)
];
