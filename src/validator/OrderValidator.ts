import { body, param } from "express-validator";
import { checkProductExist } from "../models/product";
import { OrderProduct } from "../typings/interface";
import { asyncSome } from "../utils/arrayUtils";

export const orderCreateValidator = [
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
		.custom(
			async (value: OrderProduct[]): Promise<boolean> =>
				asyncSome(value, async (product: OrderProduct) => {
					if (
						product.order_product_quantity &&
						product.product_id &&
						(await checkProductExist(product.product_id))
					) {
						return true;
					}
					return false;
				})
		)
		.withMessage("Not valid Products")
];

export const orderEditValidator = [
	param("order_id")
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("there is no order_id"),

	body("user_id")
		.optional()
		.not()
		.isEmpty({ ignore_whitespace: true })
		.trim()
		.escape()
		.withMessage("there is no user_id"),

	body("order_products")
		.optional()
		.isArray()
		.exists()
		.withMessage("there is no products")
		.isArray({ min: 1 })
		.withMessage(`at least 1 item required`)
];
