import supertest from "supertest";
import {
	categoryIndex,
	categoryProductsShow,
	categoryShow
} from "../../models/category";
import { app } from "../../server";
import { Category } from "../../typings/interface";

describe("Category Endpoint /api/category", () => {
	const req = supertest(app);
	const newCategory: Category = {
		category_id: -1,
		category_name: "Electronics",
		category_description: "electronic category description"
	};

	it("POST should create new category POST /api/category", done => {
		req.post("/api/category")
			.send({
				category_name: newCategory.category_name,
				category_description: newCategory.category_description
			})

			.expect(201)
			.then(async response => {
				expect(response.body.data.category_id).toBeTruthy();
				newCategory.category_id = response.body.data.category_id;
				expect(response.body.data).toEqual(
					await categoryShow(`${newCategory.category_id}`)
				);
				done();
			});
	});

	it(" GET /api/category/:category_id should return correct category", done => {
		req.get(`/api/category/${newCategory.category_id}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await categoryShow(`${newCategory.category_id}`)
				);
				done();
			});
	});

	it(" GET /api/category/:category_id/products should return correct category with products", done => {
		req.get(`/api/category/1/products`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data.category_products).toEqual(
					jasmine.any(Array)
				);
				expect(
					response.body.data.category_products.length
				).toBeTruthy();
				expect(response.body.data).toEqual(
					await categoryProductsShow("1")
				);
				done();
			});
	});

	it(" GET /api/category should return list of categories", done => {
		req.get("/api/category")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data[1]).toEqual(
					await categoryShow(`${newCategory.category_id}`)
				);
				done();
			});
	});

	it(" Delete /api/category should delete the category", done => {
		req.delete(`/api/category/${newCategory.category_id}`)
			.expect(200)
			.then(async () => {
				const categoryInDatabase = await categoryShow("1");
				expect(await categoryIndex()).toEqual([categoryInDatabase]);
				done();
			});
	});
});
