import { QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { asyncSome } from "../utils/arrayUtils";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import {
	orderAllProducts,
	orderProductCreate,
	orderRemoveAllProducts
} from "./orderPRoducts";
import { checkProductExist } from "./product";
import {
	orderRemoveQuery,
	orderShowQuery,
	ordersIndexQuery
} from "./queries/ordersQueries";
import { userShow } from "./user";

export const orderIndex = async (): Promise<
	Omit<Order, "order_products">[]
> => {
	try {
		const conn = await client.connect();

		const result: QueryResult<Order> = await conn.query(ordersIndexQuery);
		conn.release();
		const data: Omit<Order, "order_products">[] = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id
		}));
		return data;
	} catch (err) {
		throw new Error(`orders index : ${err}`);
	}
};

export const orderShow = async (
	order_id: string | number
): Promise<Omit<Order, "order_products"> | undefined> => {
	try {
		const conn = await client.connect();
		const result = await conn.query(orderShowQuery, [order_id]);
		conn.release();
		const data: Omit<Order, "order_products"> = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id
		}))[0];
		return data;
	} catch (err) {
		throw new Error(`orders index : ${err}`);
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
			order_products: products as OrderProduct[]
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
}: Omit<Order, "order_id">): Promise<Order | undefined> => {
	try {
		if (!order_products || order_products.length < 1)
			throw new Error("No products");

		const someProductsExist = await asyncSome(
			order_products,
			async (product: OrderProduct) => {
				if (
					product.order_product_quantity &&
					product.product_id &&
					(await checkProductExist(product.product_id))
				) {
					return true;
				}
				return false;
			}
		);

		if (!someProductsExist) throw new Error("No products");

		const out = queryPrepare<Order>({
			user_id,
			order_date
		});

		const sql = createInsert("orders", out.keys);
		const conn = await client.connect();
		const result: QueryResult<Order> = await conn.query(sql, out.values);
		conn.release();

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

		const data: Order | undefined = await showOrderDetails(order_id);

		return data;
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
	}
};

export const orderPatch = async ({
	order_id,
	user_id,
	order_date,
	order_products
}: OrderQuery): Promise<Omit<Order, "order_products"> | undefined> => {
	if (!order_id) throw new Error("order can not be patched");
	try {
		const out = queryPrepare<Order>({
			user_id,
			order_date
		});
		if (out.keys.length > 0 || out.values.length > 0) {
			const sql = createPatch(
				["order_id"],
				"orders",
				[`${order_id}`],
				out.keys
			);
			if (sql === undefined) {
				throw new Error("not patched empty sql query");
			}
			const conn = await client.connect();
			await conn.query(sql, out.values);
			conn.release();
		}

		if (order_products && (order_products as OrderProduct[]).length > 0) {
			const someProductsExist = await asyncSome(
				order_products,
				async (product: OrderProduct) => {
					if (
						product.order_product_quantity &&
						product.product_id &&
						(await checkProductExist(product.product_id))
					) {
						return true;
					}
					return false;
				}
			);

			if (!someProductsExist) throw new Error("No products");

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
		const data = await showOrderDetails(order_id);
		return data;
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
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
		conn.release();
		await orderRemoveAllProducts(order_id);

		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Order with id: ${order_id} can not be removed: ${err}`
		);
	}
};
