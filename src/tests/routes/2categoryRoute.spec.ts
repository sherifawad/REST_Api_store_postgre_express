import supertest from "supertest";
import { categoryProductsShow, categoryShow } from "../../models/category";
import { app } from "../../server";
import client from "../../services/connection";
import testData from "../helpers/testData";

describe("Category Endpoint /api/category", () => {
	afterAll(() => {
		console.log(
			`function:Category Router afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		console.log("=========================================");
	});
	const req = supertest(app);

	it("POST should create new category POST /api/category", done => {
		req.post("/api/category")
			.set("Content-Type", "application/json")
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.send({
				category_name: testData.apiTestCategory.category_name,
				category_description:
					testData.apiTestCategory.category_description
			})
			.expect(201)
			.then(async response => {
				expect(response.body.data.category_id).toBeTruthy();
				testData.apiTestCategory.category_id =
					response.body.data.category_id;
				expect(response.body.data).toEqual(
					await categoryShow(
						`${testData.apiTestCategory.category_id}`
					)
				);
				done();
			});
	});

	it(" GET /api/category/:category_id should return correct category", done => {
		req.get(`/api/category/${testData.apiTestCategory.category_id}`)
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await categoryShow(
						`${testData.apiTestCategory.category_id}`
					)
				);
				done();
			});
	});

	it(" GET /api/category/:category_id/products should return correct category with products", done => {
		req.get(`/api/category/1/products`)
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
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
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data[1]).toEqual(
					await categoryShow(
						`${testData.apiTestCategory.category_id}`
					)
				);
				done();
			});
	});

	// it(" Delete /api/category should delete the category", done => {
	// 	req.delete(`/api/category/${testData.apiTestCategory.category_id}`)
	// 		.expect(200)
	// 		.then(async () => {
	// 			const categoryInDatabase = await categoryShow("1");
	// 			expect(await categoryIndex()).toEqual([categoryInDatabase]);
	// 			done();
	// 		});
	// });
});
