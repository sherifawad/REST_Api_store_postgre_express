import { create, index, patch, Remove, show } from "../../models/product";
import { ProductQuery } from "../../typings/types";

describe("Product Model", () => {
	it("should have an index method", () => {
		expect(index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(show).toBeDefined();
	});

	it("should have a create method", () => {
		expect(create).toBeDefined();
	});

	it("should have a update method", () => {
		expect(patch).toBeDefined();
	});

	it("should have a delete method", () => {
		expect(Remove).toBeDefined();
	});

	it("create method should add a product", async () => {
		const result = await create({
			product_name: "Nokia 3310",
			product_description: "a mobile made from strong materials",
			product_price: 3310,
			category_id: 1
		} as unknown as ProductQuery);

		await create({
			product_name: "Nokia 3.21 plus",
			product_description: "SmartNokia Phone",
			product_price: 2150,
			category_id: 1
		} as unknown as ProductQuery);
		expect(result).toEqual({
			product_id: 1,
			product_name: "Nokia 3310",
			product_description: "a mobile made from strong materials",
			product_price: "3310.00",
			category_id: 1
		});
	});

	it("index method should return a list of products", async () => {
		const result = await index();
		expect(result).toEqual([
			{
				product_id: 1,
				product_name: "Nokia 3310",
				product_description: "a mobile made from strong materials",
				product_price: "3310.00",
				category_id: 1
			},
			{
				product_id: 2,
				product_name: "Nokia 3.21 plus",
				product_description: "SmartNokia Phone",
				product_price: "2150.00",
				category_id: 1
			}
		]);
	});

	it("show method should return the correct product", async () => {
		const result = await show("1");

		expect(result).toEqual({
			product_id: 1,
			product_name: "Nokia 3310",
			product_description: "a mobile made from strong materials",
			product_price: "3310.00",
			category_id: 1,
			category: {
				category_id: 1,
				category_name: "Electronics patched",
				category_description: "electronic category description"
			}
		});
	});

	it("show method should patch product", async () => {
		const result = await patch({
			product_id: 1,
			product_price: 300
		} as unknown as ProductQuery);
		expect(result).toEqual({
			product_id: 1,
			product_name: "Nokia 3310",
			product_description: "a mobile made from strong materials",
			product_price: "300.00",
			category_id: 1
		});
	});

	// it("delete method should remove the product", async () => {
	// 	await Remove("1");
	// 	const result = await index();

	// 	expect(result).toEqual([]);
	// });
});
