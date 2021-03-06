import {
	productCreate,
	productIndex,
	productPatch,
	productRemove,
	productShow
} from "../../models/product";
import client from "../../services/connection";
import { ProductQuery } from "../../typings/types";
import testData from "../helpers/testData";

describe("Product Model", () => {
	afterAll(() => {
		console.log(
			`function: Product Model afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		console.log("=========================================");
	});
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

	it("create method should add a product", async () => {
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
	});

	it("index method should return a list of products", async () => {
		const result = await productIndex();
		expect(result).toEqual([testData.dataBaseTestProduct]);
	});

	it("show method should return the correct product", async () => {
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
	});

	it("show method should patch product", async () => {
		testData.dataBaseTestProduct.product_price = "300.00";
		const result = await productPatch({
			product_id: testData.dataBaseTestProduct.product_id,
			product_price: testData.dataBaseTestProduct.product_price
		} as unknown as ProductQuery);
		expect(result).toEqual(testData.dataBaseTestProduct);
	});

	// it("delete method should remove the product", async (done) => {
	// 	await productRemove("1");
	// 	const result = await index();

	// 	expect(result).toEqual([]);
	// });
});
