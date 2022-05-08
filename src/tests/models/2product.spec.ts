import {
	productCreate,
	productIndex,
	productPatch,
	productRemove,
	productShow
} from "../../models/product";
import { ProductQuery } from "../../typings/types";
import testData from "../helpers/testData";

describe("Product Model", () => {
	it("should have an index method", () => {
		expect(productIndex).toBeDefined();
	});

	it("should have a show method", () => {
		expect(productShow).toBeDefined();
	});

	it("should have a create method", () => {
		expect(productCreate).toBeDefined();
	});

	it("should have a update method", () => {
		expect(productPatch).toBeDefined();
	});

	it("should have a delete method", () => {
		expect(productRemove).toBeDefined();
	});

	it("create method should add a product", async done => {
		const result = await productCreate({
			product_name: testData.dataBaseTestProduct.product_name,
			product_description:
				testData.dataBaseTestProduct.product_description,
			product_price: testData.dataBaseTestProduct.product_price,
			category_id: testData.dataBaseTestProduct.category_id
		} as unknown as ProductQuery);
		testData.dataBaseTestProduct.product_id =
			result.product_id as unknown as number;
		expect(result).toEqual(testData.dataBaseTestProduct);
		done();
	});

	it("index method should return a list of products", async done => {
		const result = await productIndex();
		expect(result).toEqual([testData.dataBaseTestProduct]);
		done();
	});

	it("show method should return the correct product", async done => {
		const result = await productShow(
			testData.dataBaseTestProduct.product_id
		);

		expect(result).toEqual({
			...testData.dataBaseTestProduct,
			category: {
				category_id: testData.dataBaseTestCategory.category_id,
				category_name: testData.dataBaseTestCategory.category_name,
				category_description:
					testData.dataBaseTestCategory.category_description
			}
		});
		done();
	});

	it("show method should patch product", async done => {
		testData.dataBaseTestProduct.product_price = "300.00";
		const result = await productPatch({
			product_id: testData.dataBaseTestProduct.product_id,
			product_price: testData.dataBaseTestProduct.product_price
		} as unknown as ProductQuery);
		expect(result).toEqual(testData.dataBaseTestProduct);
		done();
	});

	// it("delete method should remove the product", async (done) => {
	// 	await productRemove("1");
	// 	const result = await index();

	// 	expect(result).toEqual([]);
	// done();
	// });
});
