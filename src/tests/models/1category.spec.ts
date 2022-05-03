import {
	categoryCreate,
	categoryIndex,
	categoryPatch,
	categoryRemove,
	categoryShow
} from "../../models/category";
import { CategoryQuery } from "../../typings/types";

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

	it("create method should add a category", async () => {
		const result = await categoryCreate({
			category_name: "Electronics",
			category_description: "electronic category description"
		} as unknown as CategoryQuery);
		expect(result).toEqual({
			category_id: 1,
			category_name: "Electronics",
			category_description: "electronic category description"
		});
	});

	it("index method should return a list of categories", async () => {
		const result = await categoryIndex();
		expect(result).toEqual([
			{
				category_id: 1,
				category_name: "Electronics",
				category_description: "electronic category description"
			}
		]);
	});

	it("show method should return the correct category", async () => {
		const result = await categoryShow("1");
		expect(result).toEqual({
			category_id: 1,
			category_name: "Electronics",
			category_description: "electronic category description"
		});
	});

	it("show method should patch category", async () => {
		const result = await categoryPatch({
			category_id: 1,
			category_name: "Electronics patched"
		} as unknown as CategoryQuery);
		expect(result).toEqual({
			category_id: 1,
			category_name: "Electronics patched",
			category_description: "electronic category description"
		});
	});

	// it("delete method should remove the category", async () => {
	// 	await categoryRemove("1");
	// 	const result = await index();

	// 	expect(result).toEqual([]);
	// });
});
