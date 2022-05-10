import * as _ from "lodash";
import { categoryProductsShow } from "../../models/category";
import client from "../../services/connection";
import testData from "../helpers/testData";

describe("Extra", () => {
	afterAll(() => {
		client.on("connect", () => {
			console.log(
				`function: Extra Model afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
			);
		});
		console.log("=========================================");
	});
	it("Category products method should return a list of products with specified category Id", async done => {
		const result = await categoryProductsShow(
			testData.dataBaseTestCategory.category_id
		);
		expect(result).toEqual({
			category_id: testData.dataBaseTestCategory.category_id,
			category_name: testData.dataBaseTestCategory.category_name,
			category_description:
				testData.dataBaseTestCategory.category_description,
			category_products: [
				_.omit(testData.dataBaseTestProduct, ["category_id"])
			]
		});
		done();
	});
});
