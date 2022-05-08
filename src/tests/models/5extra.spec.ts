import * as _ from "lodash";
import { categoryProductsShow } from "../../models/category";
import testData from "../helpers/testData";

describe("Extra", () => {
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
