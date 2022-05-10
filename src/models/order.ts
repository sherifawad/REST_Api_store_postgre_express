import { QueryResult } from "pg";
import client, { handleError } from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { asyncSome } from "../utils/arrayUtils";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import {
	orderProductsDetails,
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
	Omit<Order, "order_products">[] | void
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
		handleError(new Error(`orders index : ${err}`));
	}
};

export const orderShow = async (
	order_id: string | number
): Promise<Omit<Order, "order_products"> | undefined | void> => {
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
		handleError(new Error(`orders index : ${err}`));
	}
};

export const showOrderDetails = async (
	order_id: string | number
): Promise<Order | undefined | void> => {
	try {
		const order = await orderShow(order_id);
		if (!order) return undefined;
		const user = await userShow(order.user_id);
		const products = await orderProductsDetails(order_id);

		const data: Order = {
			order_id: order.order_id,
			order_date: order.order_date,
			user_id: order.user_id,
			user,
			order_products: products as OrderProduct[]
		};
		return data;
	} catch (error) {
		handleError(new Error(`orders details : ${error}`));
	}
};

export const orderCreate = async ({
	user_id,
	order_date,
	order_products
}: Omit<Order, "order_id">): Promise<
	Omit<Order, "user"> | undefined | void
> => {
	try {
		if (!order_products || order_products.length < 1)
			throw new Error("No products");
		// let someProductsExist = false;

		// (async () => {
		// 	for (const product of order_products) {
		// 		// eslint-disable-next-line no-await-in-loop
		// 		const exist = await checkProductExist(product.product_id);
		// 		if (exist) {
		// 			someProductsExist = true;
		// 			break;
		// 		}
		// 	}
		// })();

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

		if (!someProductsExist) {
			throw new Error("No products");
		}

		const out = queryPrepare<Order>({
			user_id,
			order_date
		});

		const sql = createInsert("orders", out.keys);

		console.log(
			`function: before order create, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		const conn = await client.connect();
		const result: QueryResult<Order> = await conn.query(sql, out.values);
		conn.release();

		console.log(
			`function: after order create, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);

		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { order_id } = result.rows[0];
		if (!order_id) {
			throw new Error("orders Creation Error");
		}
		const listOfProducts: OrderProduct[] = [];

		await Promise.all(
			order_products.map(async product => {
				const addResult = await orderProductCreate({
					order_id,
					product_id: product.product_id,
					order_product_quantity: product.order_product_quantity
				});
				if (addResult) {
					listOfProducts.push(addResult);
				}
			})
		);

		const data: Order | undefined | void = {
			order_id,
			order_date: (
				result.rows[0].order_date as unknown as Date
			).toISOString(),
			user_id: result.rows[0].user_id,
			order_products: listOfProducts
		};

		return data;
	} catch (err) {
		handleError(new Error(`Order not created: ${err}`));
	}
};

export const orderPatch = async ({
	order_id,
	user_id,
	order_date,
	order_products
}: OrderQuery): Promise<void> => {
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

		console.log(
			`function: before order patch asyncSome, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);

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

			console.log(
				`function: after order patch asyncSome, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
			);

			if (!someProductsExist) {
				throw new Error("No products");
			}

			console.log(
				`function: before order patch orderRemoveAllProducts, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
			);
			// remove products within order
			await orderRemoveAllProducts(order_id);

			console.log(
				`function: after order patch orderRemoveAllProducts, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
			);

			await Promise.all(
				order_products.map(async product => {
					await orderProductCreate({
						order_id,
						product_id: product.product_id,
						order_product_quantity: product.order_product_quantity
					});
				})
			);
		}

		console.log(
			`function: after order Patch, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
	} catch (err) {
		handleError(new Error(`Order not created: ${err}`));
	}
};

export const orderRemove = async (
	order_id: string | number
): Promise<Order | void> => {
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
		handleError(
			new Error(`Order with id: ${order_id} can not be removed: ${err}`)
		);
	}
};
