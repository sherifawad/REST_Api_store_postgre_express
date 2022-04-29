import { create, index } from "../../models/order";
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
			products: [
				{
					quantity: 5,
					product_id: 1
				},
				{
					quantity: 10,
					product_id: 2
				}
			]
		} as unknown as OrderQuery);
		expect(result).toEqual({
			id: 1,
			user_id: 1
		});
	});

	it("index method should return a list of orders", async () => {
		const result = await index();
		expect(result).toEqual([]);
	});
});
