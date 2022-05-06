import { QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import {
	orderAllProducts,
	orderProductCreate,
	orderProductPatch,
	orderProductsIndex,
	orderRemoveAllProducts
} from "./orderPRoducts";
import { checkProductExist } from "./product";
import {
	orderProductsQuery,
	orderRemoveQuery,
	orderShowQuery,
	ordersIndexQuery
} from "./queries/ordersQueries";
import { userShow } from "./user";

export const orderIndex = async (): Promise<
	Omit<Order, "order_products">[]
> => {
	let conn;
	try {
		conn = await client.connect();

		const result: QueryResult<Order> = await conn.query(ordersIndexQuery);

		const data: Omit<Order, "order_products">[] = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id
		}));
		return data;
	} catch (err) {
		throw new Error(`orders index : ${err}`);
	} finally {
		if (conn) conn.release(); // release to pool
	}
};

export const orderShow = async (
	order_id: string | number
): Promise<Order | undefined> => {
	let conn;
	try {
		const products = await orderProductsIndex(order_id);
		console.log("🚀 ~ file: order.ts ~ line 50 ~ products", products);
		conn = await client.connect();
		const result = await conn.query(orderShowQuery, [order_id]);
		const data: Order = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id,
			order_products: products
		}))[0];
		return data;
	} catch (err) {
		throw new Error(`orders index : ${err}`);
	} finally {
		if (conn) conn.release(); // release to pool
	}
};

export const showOrderDetails = async (
	order_id: string | number
): Promise<Order | undefined> => {
	try {
		const order = await orderShow(order_id);
		if (!order) return undefined;
		const user = await userShow(order.user_id);
		const products = await orderAllProducts(order_id);

		const data: Order = {
			order_id: order.order_id,
			order_date: order.order_date,
			user_id: order.user_id,
			user,
			order_products: products
		};
		return data;
	} catch (error) {
		throw new Error(`orders details : ${error}`);
	}
};

export const orderCreate = async ({
	user_id,
	order_date,
	order_products
}: Omit<Order, "order_id">): Promise<Omit<Order, "order_products">> => {
	const conn = await client.connect();
	try {
		if (!order_products || order_products.length < 1)
			throw new Error("No products");
		const productsExists = order_products.some(
			async v =>
				v.order_product_quantity &&
				v.product_id &&
				(await checkProductExist(v.product_id))
		);
		if (!productsExists) throw new Error("No products");

		const out = queryPrepare<Order>({
			user_id,
			order_date
		});

		const sql = createInsert("orders", out.keys);
		const result: QueryResult<Order> = await conn.query(sql, out.values);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { order_id } = result.rows[0];
		if (!order_id) {
			throw new Error("orders Creation Error");
		}

		(order_products as OrderProduct[]).forEach(async product => {
			await orderProductCreate({
				order_id,
				product_id: product.product_id,
				order_product_quantity: product.order_product_quantity
			});
		});

		const data: Omit<Order, "order_products"> = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id
		}))[0];

		return data;
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

export const orderPatch = async ({
	order_id,
	user_id,
	order_date,
	order_products
}: OrderQuery): Promise<Omit<Order, "order_products"> | undefined> => {
	if (!order_id) throw new Error("order can not be patched");
	const conn = await client.connect();
	try {
		let result: QueryResult<Order> | undefined;

		const out = queryPrepare<Order>({
			user_id,
			order_date
		});
		if (out.keys.length > 0 || out.values.length > 0) {
			const sql = createPatch(
				"order_id",
				"orders",
				`${order_id}`,
				out.keys
			);
			result = await conn.query(sql, out.values);
		}

		if (order_products && (order_products as OrderProduct[]).length > 0) {
			const productsExists = order_products.some(
				async v =>
					v.order_product_quantity &&
					v.product_id &&
					(await checkProductExist(v.product_id))
			);
			if (!productsExists) throw new Error("No products");

			// remove products within order
			await orderRemoveAllProducts(order_id);

			(order_products as OrderProduct[]).forEach(async product => {
				await orderProductCreate({
					order_id,
					product_id: product.product_id,
					order_product_quantity: product.order_product_quantity
				});
			});
		}

		if (result) {
			const data: Omit<Order, "order_products"> = result.rows.map(
				row => ({
					order_id: row.order_id,
					order_date: (
						row.order_date as unknown as Date
					).toISOString(),
					user_id: row.user_id
				})
			)[0];
			return data;
		}
		return undefined;
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

export const orderRemove = async (
	order_id: string | number
): Promise<Order> => {
	let conn;
	try {
		conn = await client.connect();
		const result: QueryResult<Order> = await conn.query(orderRemoveQuery, [
			order_id
		]);
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Order with id: ${order_id} can not be removed: ${err}`
		);
	} finally {
		if (conn) {
			conn.release();
		}
	}
};
