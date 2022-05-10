import supertest from "supertest";
import * as _ from "lodash";
import { orderIndex, orderShow, showOrderDetails } from "../../models/order";
import { app } from "../../server";
import client from "../../services/connection";
import testData from "../helpers/testData";
import { orderProducts } from "../../models/orderPRoducts";

describe("Orders Endpoint /api/order", () => {
	afterAll(() => {
		console.log(
			`function: Order Router afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		console.log("=========================================");
	});

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
				const order = await orderShow(
					`${testData.apiTestOrder.order_id}`
				);
				const products = await orderProducts(
					`${testData.apiTestOrder.order_id}`
				);

				const construct = {
					...order,
					order_products: products
				};
				expect(response.body.data).toEqual(construct);
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
	it(" Delete /api/order should delete the order", done => {
		req.delete(`/api/order/${testData.apiTestOrder.order_id}`)
			.set("Authorization", `token ${testData.apiTestUserToken}`)
			.expect(200)
			.then(async () => {
				expect(
					await orderShow(`${testData.apiTestOrder.order_id}`)
				).toEqual(undefined);
				done();
			});
	});
});
