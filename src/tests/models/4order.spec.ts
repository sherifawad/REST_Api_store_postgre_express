import * as _ from "lodash";
import {
	orderCreate,
	orderIndex,
	orderPatch,
	orderRemove,
	orderShow,
	showOrderDetails
} from "../../models/order";
import client from "../../services/connection";
import { Order, OrderProduct } from "../../typings/interface";
import { OrderQuery } from "../../typings/types";
import testData from "../helpers/testData";

describe("Order Model", () => {
	afterAll(() => {
		console.log(
			`function: Order Model afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		console.log("=========================================");
	});

	it("should have an index method", () => {
		expect(orderIndex).toBeDefined();
	});

	it("should have a create method", () => {
		expect(orderCreate).toBeDefined();
	});

	it("should have a show method", () => {
		expect(orderShow).toBeDefined();
	});

	it("should have a update method", () => {
		expect(orderPatch).toBeDefined();
	});

	it("should have a remove method", () => {
		expect(orderRemove).toBeDefined();
	});

	it("create method should add a order", async () => {
		const result = await orderCreate({
			user_id: testData.dataBaseTestOrder.user_id,
			order_date: testData.dataBaseTestOrder.order_date,
			order_products: testData.dataBaseTestOrder.order_products
		} as unknown as Omit<Order, "order_id">);

		if (result)
			testData.dataBaseTestOrder.order_id = result.order_id as number;
		const construct = {
			...testData.dataBaseTestOrder,
			order_products: [
				{
					...testData.dataBaseTestOrder.order_products[0],
					order_id: testData.dataBaseTestOrder.order_id
				}
			]
		};
		expect(result).toEqual(construct);
	});

	it("show order method should return the correct order", async () => {
		const result = await orderShow(testData.dataBaseTestOrder.order_id);
		expect(result).toEqual(
			_.omit(testData.dataBaseTestOrder, ["order_products"])
		);
	});

	it("index method should return a list of orders", async () => {
		const result = await orderIndex();
		expect(result).toEqual([
			_.omit(testData.dataBaseTestOrder, ["order_products"])
		]);
	});

	it("patch method should patch a order product quantity", async () => {
		testData.dataBaseTestOrder.order_products[0].order_product_quantity = 8;
		expect(async () =>
			orderPatch({
				order_id: testData.dataBaseTestOrder.order_id,
				order_products: testData.dataBaseTestOrder.order_products
			} as unknown as OrderQuery)
		).not.toThrow();
	});

	it("show order details method should return the correct order details", async () => {
		const result = await showOrderDetails(
			testData.dataBaseTestOrder.order_id
		);
		const constructed = {
			..._.omit(testData.dataBaseTestOrder, ["order_products"]),
			user: _.omit(testData.dataBaseTestUser, ["user_password"]),
			order_products: [
				{
					..._.omit(testData.dataBaseTestOrder.order_products[0], [
						"product_id"
					]),
					product: {
						..._.omit(testData.dataBaseTestProduct, [
							"category_id"
						]),
						category: testData.dataBaseTestCategory
					}
				} as OrderProduct
			]
		};
		expect(result).toEqual(constructed);
	});

	it("delete method should remove the order", async () => {
		await orderRemove(testData.dataBaseTestOrder.order_id);
		const result = await orderIndex();

		expect(result).toEqual([]);
	});
});
