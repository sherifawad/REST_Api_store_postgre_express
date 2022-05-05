import supertest from "supertest";
import { productIndex, productShow } from "../../models/product";
import { app } from "../../server";
import testData from "../helpers/testData";

describe("Products Endpoint /api/product", () => {
	const req = supertest(app);

	it("POST should create new product POST /api/product", done => {
		req.post("/api/product")
			.set("Content-Type", "application/json")
			.set("Authorization", `Bearer ${testData.apiTestUserToken}`)
			.send({
				product_name: testData.apiTestProduct.product_name,
				product_description:
					testData.apiTestProduct.product_description,
				product_price: testData.apiTestProduct.product_price,
				category_id: testData.apiTestProduct.category_id
			})
			.expect(201)
			.then(async response => {
				testData.apiTestProduct.product_id =
					response.body.data.product_id;
				expect(response.body.data.product_id).toBeTruthy();
				expect(response.body.data).toEqual(testData.apiTestProduct);
				done();
			});
	});

	it(" GET /api/product/:product_id should return correct product", done => {
		req.get(`/api/product/${testData.apiTestProduct.product_id}`)
			.set("Authorization", `Bearer ${testData.apiTestUserToken}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await productShow(`${testData.apiTestProduct.product_id}`)
				);
				done();
			});
	});

	it(" GET /api/product should return list of products", done => {
		req.get("/api/product")
			.set("Authorization", `Bearer ${testData.apiTestUserToken}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await productIndex());
				done();
			});
	});

	it(" Delete /api/product should delete the product", done => {
		req.delete(`/api/product/${testData.apiTestProduct.product_id}`)
			.set("Authorization", `Bearer ${testData.apiTestUserToken}`)
			.expect(200)
			.then(async () => {
				expect((await productIndex())[0]).toEqual(
					testData.dataBaseTestProduct
				);
				done();
			});
	});
});
