import {
	orderCreate,
	orderIndex,
	orderOnlyShow,
	orderPatch,
	orderRemove,
	orderShow
} from "../../models/order";
import { Order, OrderProduct } from "../../typings/interface";
import { OrderQuery } from "../../typings/types";

describe("Order Model", () => {
	const newOrder: Order = {
		order_id: -1,
		user_id: 1,
		order_date: new Date().toISOString(),
		order_products: [
			{
				order_product_quantity: 5,
				product_id: 1
			} as unknown as OrderProduct
		]
	};

	it("should have an index method", () => {
		expect(orderIndex).toBeDefined();
	});

	it("should have a create method", () => {
		expect(orderCreate).toBeDefined();
	});

	it("should have a show method", () => {
		expect(orderShow).toBeDefined();
	});

	it("should have a update method", () => {
		expect(orderPatch).toBeDefined();
	});

	it("should have a remove method", () => {
		expect(orderRemove).toBeDefined();
	});

	it("create method should add a order", async () => {
		const result = await orderCreate({
			user_id: newOrder.user_id,
			order_date: newOrder.order_date,
			order_products: newOrder.order_products
		} as unknown as Omit<Order, "order_id">);
		newOrder.order_id = result.order_id;
		expect(result).toEqual(await orderOnlyShow(`${newOrder.order_id}`));
	});

	it("index method should return a list of orders", async () => {
		const result = await orderIndex();
		expect(result).toEqual([
			{
				order_id: 1,
				order_date: newOrder.order_date,
				user_id: 1,
				user: {
					user_id: 1,
					user_email: "email@c.com",
					user_firstname: "Sh",
					user_lastname: "A",
					user_active: false
				},
				order_products: [
					{
						order_product_id: 1,
						order_id: 1,
						order_product_quantity: 5,
						product_id: 1,
						product_name: "Nokia 3310",
						product_description:
							"a mobile made from strong materials",
						product_price: "300.00",
						user_id: 1
					}
				]
			}
		]);
	});

	it("patch method should patch a order product quantity", async () => {
		const result = await orderPatch({
			order_id: 1,
			order_products: [
				{
					order_product_id: 1,
					order_product_quantity: 8
				},
				{
					order_product_quantity: 3,
					product_id: 2
				}
			]
		} as unknown as OrderQuery);
		expect(result).toEqual(undefined);
	});

	it("show method should return the correct product", async () => {
		const result = await orderShow("1");

		expect(result).toEqual({
			order_id: 1,
			order_date: newOrder.order_date,
			user_id: 1,
			user: {
				user_id: 1,
				user_email: "email@c.com",
				user_firstname: "Sh",
				user_lastname: "A",
				user_active: false
			},
			order_products: [
				{
					order_product_id: 1,
					order_id: 1,
					order_product_quantity: 8,
					product_id: 1,
					product_name: "Nokia 3310",
					product_description: "a mobile made from strong materials",
					product_price: "300.00",
					user_id: 1
				},
				{
					order_product_id: 2,
					order_id: 1,
					order_product_quantity: 3,
					product_id: 2,
					product_name: "Nokia 3.21 plus",
					product_description: "SmartNokia Phone",
					product_price: "2150.00",
					user_id: 1
				}
			]
		});
	});

	it("delete method should remove the order", async () => {
		await orderRemove("1");
		const result = await orderIndex();

		expect(result).toEqual([]);
	});
});
