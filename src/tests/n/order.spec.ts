import { create, index, patch, Remove, show } from "../../models/order";
import { OrderQuery } from "../../typings/types";

describe("Order Model", () => {
	it("should have an index method", () => {
		expect(index).toBeDefined();
	});

	it("should have a create method", () => {
		expect(create).toBeDefined();
	});

	it("create method should add a order", async () => {
		const result = await create({
			user_id: 1,
			order_products: [
				{
					order_product_quantity: 5,
					product_id: 1
				},
				{
					order_product_quantity: 10,
					product_id: 2
				}
			],
			order_date: new Date(
				"Sat Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
			)
		} as unknown as OrderQuery);
		expect(result).toEqual({
			order_id: 1,
			order_date: new Date(
				"Sat Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
			),
			user_id: 1
		});
	});

	it("index method should return a list of orders", async () => {
		const result = await index();
		expect(result).toEqual([
			{
				order_id: 1,
				order_date: new Date(
					"Sat Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
				),
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
					},
					{
						order_product_id: 2,
						order_id: 1,
						order_product_quantity: 10,
						product_id: 2,
						product_name: "Nokia 3.21 plus",
						product_description: "SmartNokia Phone",
						product_price: "2150.00",
						user_id: 1
					}
				]
			}
		]);
	});

	it("patch method should patch a order date", async () => {
		const result = await patch({
			order_id: 1,
			order_date: new Date(
				"Sun Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
			)
		} as unknown as OrderQuery);
		expect(result).toEqual({
			order_id: 1,
			order_date: new Date(
				"Sun Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
			),
			user_id: 1
		});
	});

	it("patch method should patch a order product quantity", async () => {
		const result = await patch({
			order_id: 1,
			order_products: [
				{
					order_product_id: 2,
					order_product_quantity: 2
				}
			]
		} as unknown as OrderQuery);
		expect(result).toEqual(undefined);
	});

	it("show method should return the correct product", async () => {
		const result = await show("1");

		expect(result).toEqual({
			order_id: 1,
			order_date: new Date(
				"Sun Apr 30 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
			),
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
					product_description: "a mobile made from strong materials",
					product_price: "300.00",
					user_id: 1
				},
				{
					order_product_id: 2,
					order_id: 1,
					order_product_quantity: 2,
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
		await Remove("1");
		const result = await index();

		expect(result).toEqual([]);
	});
});
