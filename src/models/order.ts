import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import { checkProductExist } from "./product";
import {
	orderRemoveQuery,
	orderShowQuery,
	ordersIndexQuery,
	showOrderDetailsQuery
} from "./queries/ordersQueries";
import { userShow } from "./user";

export const orderIndex = async (): Promise<
	Omit<Order, "order_products">[]
> => {
	try {
		const conn: PoolClient = await client.connect();

		const result = await conn.query(ordersIndexQuery);
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

export const orderCreate = async ({
	user_id,
	order_date,
	order_products
}: Omit<Order, "order_id">): Promise<Omit<Order, "order_products">> => {
	try {
		const conn: PoolClient = await client.connect();

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
			const productExist = await checkProductExist(product.product_id);
			if (productExist) {
				const OutOrderProduct = queryPrepare<OrderProduct>({
					order_id,
					product_id: product.product_id,
					order_product_quantity: product.order_product_quantity
				});

				const SqlOrderProduct = createInsert(
					"orders_products",
					OutOrderProduct.keys
				);
				await conn.query(SqlOrderProduct, OutOrderProduct.values);
			} else {
				console.error(
					`Product with Id: ${product.product_id} not found`
				);
			}
		});

		conn.release();
		const data: Omit<Order, "order_products"> = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: (row.order_date as unknown as Date).toISOString(),
			user_id: row.user_id
		}))[0];

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
		const conn: PoolClient = await client.connect();

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
			(order_products as OrderProduct[]).forEach(async product => {
				const OutOrderProduct = queryPrepare<OrderProduct>({
					order_id,
					product_id: product.product_id,
					order_product_quantity: product.order_product_quantity
				});

				let SqlOrderProduct: string;

				if (product.order_product_id) {
					SqlOrderProduct = createPatch(
						"order_product_id",
						"orders_products",
						`${product.order_product_id}`,
						OutOrderProduct.keys
					);
				} else {
					const productExist = await checkProductExist(
						product.product_id
					);
					if (productExist) {
						SqlOrderProduct = createInsert(
							"orders_products",
							OutOrderProduct.keys
						);
						await conn.query(
							SqlOrderProduct,
							OutOrderProduct.values
						);
					} else {
						console.error(
							`Product with Id: ${product.product_id} not found`
						);
					}
				}
			});
		}

		conn.release();
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
	}
};

export const orderShow = async (
	order_id: string | number
): Promise<Omit<Order, "order_products">> => {
	try {
		const conn: PoolClient = await client.connect();

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
): Promise<Order> => {
	try {
		const order = await orderShow(order_id);
		const user = await userShow(order.user_id);
		const conn: PoolClient = await client.connect();

		const result = await conn.query(showOrderDetailsQuery, [order_id]);

		const data: Order = {
			order_id: order.order_id,
			order_date: order.order_date,
			user_id: order.user_id,
			user: {
				user_id: user.user_id,
				user_email: user.user_email,
				user_firstname: user.user_firstname,
				user_lastname: user.user_lastname,
				user_active: user.user_active
			},
			order_products: result.rows.map(productRow => ({
				order_product_id: productRow.order_product_id,
				order_product_quantity: parseInt(
					productRow.order_product_quantity as unknown as string,
					10
				),
				product_id: productRow.product_id,
				product: {
					product_id: productRow.product_id,
					product_name: productRow.product_name,
					product_description: productRow.product_description,
					product_price: productRow.product_price
				}
			}))
		};
		return data;
		conn.release();
	} catch (error) {
		throw new Error(`orders details : ${error}`);
	}
};

export const orderRemove = async (
	order_id: string | number
): Promise<Order> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<Order> = await conn.query(orderRemoveQuery, [
			order_id
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Order with id: ${order_id} can not be removed: ${err}`
		);
	}
};
