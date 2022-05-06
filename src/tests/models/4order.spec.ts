import * as _ from "lodash";
import {
	orderCreate,
	orderIndex,
	orderPatch,
	orderRemove,
	orderShow,
	showOrderDetails
} from "../../models/order";
import { Order } from "../../typings/interface";
import { OrderQuery } from "../../typings/types";
import testData from "../helpers/testData";

describe("Order Model", () => {
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
		testData.dataBaseTestOrder.order_id = result.order_id as number;
		expect(result).toEqual(
			_.omit(testData.dataBaseTestOrder, ["order_products"])
		);
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
		testData.dataBaseTestOrder.order_products.push({
			order_product_id: -1,
			order_id: -1,
			user_id: 1,
			order_product_quantity: 3,
			product_id: testData.dataBaseTestProduct.product_id
		});
		const result = await orderPatch({
			order_id: testData.dataBaseTestOrder.order_id,
			order_products: testData.dataBaseTestOrder.order_products
		} as unknown as OrderQuery);
		expect(result).toEqual(undefined);
		// const data = await orderShow(testData.dataBaseTestOrder.order_id);
		// console.log("🚀 ~ file: 4order.spec.ts ~ line 117 ~ it ~ data", data);
	});

	it("delete method should remove the order", async () => {
		await orderRemove(testData.dataBaseTestOrder.order_id);
		const result = await orderIndex();

		expect(result).toEqual([]);
	});
});
