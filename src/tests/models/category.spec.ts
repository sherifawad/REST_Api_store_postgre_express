import { create, index, patch, Remove, show } from "../../models/category";
import { CategoryQuery } from "../../typings/types";

describe("Category Model", () => {
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

	it("create method should add a category", async () => {
		const result = await create({
			name: "Electronics",
			description: "electronic category description"
		} as unknown as CategoryQuery);
		expect(result).toEqual({
			id: 1,
			name: "Electronics",
			description: "electronic category description"
		});
	});

	it("index method should return a list of categories", async () => {
		const result = await index();
		expect(result).toEqual([
			{
				id: 1,
				name: "Electronics",
				description: "electronic category description"
			}
		]);
	});

	it("show method should return the correct category", async () => {
		const result = await show("1");
		expect(result).toEqual({
			id: 1,
			name: "Electronics",
			description: "electronic category description"
		});
	});

	it("delete method should remove the category", async () => {
		Remove("1");
		const result = await index();

		expect(result).toEqual([]);
	});
});
