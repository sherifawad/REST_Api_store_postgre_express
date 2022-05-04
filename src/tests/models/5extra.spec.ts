import { categoryProductsShow } from "../../models/category";

describe("Extra", () => {
	it("Category products method should return a list of products with specified category Id", async () => {
		const result = await categoryProductsShow("1");
		expect(result).toEqual({
			category_id: 1,
			category_name: "Electronics patched",
			category_description: "electronic category description",
			category_products: [
				{
					product_id: 1,
					product_name: "Nokia 3310",
					product_description: "a mobile made from strong materials",
					product_price: "300.00"
				},
				{
					product_id: 2,
					product_name: "Nokia 3.21 plus",
					product_description: "SmartNokia Phone",
					product_price: "2150.00"
				}
			]
		});
	});
});
