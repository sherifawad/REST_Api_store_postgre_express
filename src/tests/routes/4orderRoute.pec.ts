import supertest from "supertest";
import { orderIndex, orderShow, showOrderDetails } from "../../models/order";
import { app } from "../../server";
import testData from "../helpers/testData";

describe("Orders Endpoint /api/order", () => {
	const req = supertest(app);
	it("POST should create new order POST /api/order", done => {
		req.post("/api/order")
			.set("Content-Type", "application/json")
			.set("Authorization", `token ${testData.apiTestUserToken}`)
			.send({
				user_id: testData.apiTestOrder.user_id,
				order_date: testData.apiTestOrder.order_date,
				order_products: testData.apiTestOrder.order_products
			})
			.expect(201)
			.then(async response => {
				expect(response.body.data.order_id).toBeTruthy();
				testData.apiTestOrder.order_id = response.body.data.order_id;
				expect(response.body.data).toEqual(
					await orderShow(`${testData.apiTestOrder.order_id}`)
				);
				done();
			});
	});
	it(" GET /api/order/:order_id should return correct order", done => {
		req.get(`/api/order/${testData.apiTestOrder.order_id}`)
			.set("Authorization", `token ${testData.apiTestUserToken}`)
			.set("Content-Type", "application/json")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await showOrderDetails(`${testData.apiTestOrder.order_id}`)
				);
				done();
			});
	});
	it(" GET /api/order should return list of orders", done => {
		req.get("/api/order")
			.set("Authorization", `token ${testData.apiTestUserToken}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await orderIndex());
				done();
			});
	});
	// it(" Delete /api/order should delete the order", done => {
	// 	req.delete(`/api/order/${testData.apiTestOrder.order_id}`)
	// 		.set("Authorization", `token ${testData.apiTestUserToken}`)
	// 		.expect(200)
	// 		.then(async () => {
	// 			expect(
	// 				await orderShow(`${testData.apiTestOrder.order_id}`)
	// 			).toEqual(undefined);
	// 			done();
	// 		});
	// });
});
