import supertest from "supertest";
import { orderIndex, orderOnlyShow, orderShow } from "../../models/order";
import { app } from "../../server";
import { Order, OrderProduct } from "../../typings/interface";

describe("Orders Endpoint /api/order", () => {
	const req = supertest(app);
	const newOrder: Order = {
		order_id: -1,
		user_id: 1,
		order_date: new Date().toISOString(),
		order_products: [
			{
				order_product_quantity: 5,
				product_id: 1
			} as unknown as OrderProduct
		]
	};

	it("POST should create new order POST /api/order", done => {
		req.post("/api/order")
			.set("Content-Type", "application/json")
			.send({
				user_id: newOrder.user_id,
				order_date: newOrder.order_date,
				order_products: newOrder.order_products
			})

			.expect(201)
			.then(async response => {
				expect(response.body.data.order_id).toBeTruthy();
				newOrder.order_id = response.body.data.order_id;
				expect(response.body.data).toEqual(
					await orderOnlyShow(`${newOrder.order_id}`)
				);
				done();
			});
	});

	it(" GET /api/order/:order_id should return correct order", done => {
		req.get(`/api/order/${newOrder.order_id}`)
			.set("Content-Type", "application/json")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await orderShow(`${newOrder.order_id}`)
				);
				done();
			});
	});

	it(" GET /api/order should return list of orders", done => {
		req.get("/api/order")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await orderIndex());
				done();
			});
	});

	it(" Delete /api/order should delete the order", done => {
		req.delete(`/api/order/${newOrder.order_id}`)
			.expect(200)
			.then(async () => {
				expect(await orderIndex()).toEqual([]);
				done();
			});
	});
});
