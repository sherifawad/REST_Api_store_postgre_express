import {
	categoryCreate,
	categoryIndex,
	categoryPatch,
	categoryRemove,
	categoryShow
} from "../../models/category";
import { CategoryQuery } from "../../typings/types";
import testData from "../helpers/testData";

describe("Category Model", () => {
	it("should have an index method", () => {
		expect(categoryIndex).toBeDefined();
	});

	it("should have a show method", () => {
		expect(categoryShow).toBeDefined();
	});

	it("should have a create method", () => {
		expect(categoryCreate).toBeDefined();
	});

	it("should have a update method", () => {
		expect(categoryPatch).toBeDefined();
	});

	it("should have a delete method", () => {
		expect(categoryRemove).toBeDefined();
	});

	it("create method should add a category", async done => {
		const result = await categoryCreate({
			category_name: testData.dataBaseTestCategory.category_name,
			category_description:
				testData.dataBaseTestCategory.category_description
		} as unknown as CategoryQuery);
		testData.dataBaseTestCategory.category_id =
			result.category_id as unknown as number;
		expect(result).toEqual(testData.dataBaseTestCategory);
		done();
	});

	it("index method should return a list of categories", async done => {
		const result = await categoryIndex();
		expect(result).toEqual([testData.dataBaseTestCategory]);
		done();
	});

	it("show method should return the correct category", async done => {
		const result = await categoryShow(
			testData.dataBaseTestCategory.category_id
		);
		expect(result).toEqual(testData.dataBaseTestCategory);
		done();
	});

	it("show method should patch category", async done => {
		testData.dataBaseTestCategory.category_name = "Electronics patched";
		const result = await categoryPatch({
			category_id: testData.dataBaseTestCategory.category_id,
			category_name: testData.dataBaseTestCategory.category_name
		} as unknown as CategoryQuery);
		expect(result).toEqual(testData.dataBaseTestCategory);
		done();
	});

	// it("delete method should remove the category", async (done) => {
	// 	await categoryRemove("1");
	// 	const result = await index();

	// 	expect(result).toEqual([]);
	// done();
	// });
});
