import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { OrderProduct } from "../typings/interface";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import { checkProductExist } from "./product";
import {
	orderProductRemoveOPQuery,
	orderProductsDetailsQuery,
	orderProductShowQuery,
	orderProductsRemoveQuery
} from "./queries/orderProductsQueries";
import { orderProductsQuery } from "./queries/ordersQueries";

export const orderProductShow = async (
	order_id: string | number,
	product_id: string | number
): Promise<OrderProduct> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<OrderProduct> = await conn.query(
			orderProductShowQuery,
			[order_id, product_id]
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`order_product with id: ${order_id}${product_id} does not exist: ${err}`
		);
	}
};

export const orderProductsIndex = async (
	order_id: string | number
): Promise<OrderProduct[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<OrderProduct> = await conn.query(
			orderProductsQuery,
			[order_id]
		);
		conn.release();
		const data: OrderProduct[] = result.rows.map(row => ({
			order_product_quantity: row.order_product_quantity,
			product_id: row.product_id
		}));
		return data;
	} catch (err) {
		throw new Error(`No products with order id: ${order_id}: ${err}`);
	}
};

export const orderAllProducts = async (
	order_id: string | number
): Promise<Omit<OrderProduct, "product_id">[]> => {
	try {
		const conn: PoolClient = await client.connect();

		const result = await conn.query(orderProductsDetailsQuery, [order_id]);
		conn.release();

		return result.rows.map(productRow => ({
			order_product_quantity: productRow.order_product_quantity,
			product: {
				product_id: productRow.product_id,
				product_name: productRow.product_name,
				product_description: productRow.product_description,
				product_price: productRow.product_price,
				category: {
					category_id: productRow.category_id,
					category_name: productRow.category_name,
					category_description: productRow.category_description
				}
			}
		}));
	} catch (err) {
		throw new Error(`No products with order id: ${order_id}: ${err}`);
	}
};

export const orderProductCreate = async ({
	order_id,
	order_product_quantity,
	product_id
}: Omit<OrderProduct, "order_product_id">): Promise<OrderProduct> => {
	try {
		const productExist = await checkProductExist(product_id);
		if (!productExist) {
			throw new Error(`product with id: ${product_id} not exist`);
		}
		const conn = await client.connect();

		const OutOrderProduct = queryPrepare<OrderProduct>({
			order_id,
			product_id,
			order_product_quantity
		});

		const SqlOrderProduct = createInsert(
			"orders_products",
			OutOrderProduct.keys
		);
		const result = await conn.query(
			SqlOrderProduct,
			OutOrderProduct.values
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`order_product not created: ${err}`);
	}
};

export const orderProductPatch = async ({
	order_id,
	order_product_quantity,
	product_id
}: OrderProduct): Promise<OrderProduct> => {
	try {
		const productExist = await checkProductExist(product_id);
		if (!productExist) {
			throw new Error(`product with id: ${product_id} not exist`);
		}
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<OrderProduct>({
			order_product_quantity,
			product_id
		});
		const sql = createPatch(
			["order_id", "product_id"],
			"orders_products",
			[`${order_id}`, `${product_id}`],
			out.keys
		);
		console.log("🚀 ~ file: orderPRoducts.ts ~ line 137 ~ sql", sql);
		if (sql === undefined) {
			throw new Error("not patched empty sql query");
		}
		const result = await conn.query(sql, out.values);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`order_product with id: ${order_id}${product_id} not patched: ${err}`
		);
	}
};

export const orderProductRemove = async (
	order_id: string | number,
	product_id: string | number
): Promise<OrderProduct> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<OrderProduct> = await conn.query(
			orderProductRemoveOPQuery,
			[order_id, product_id]
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`order_product with id: ${order_id}${product_id} can not be removed: ${err}`
		);
	}
};

export const orderRemoveAllProducts = async (
	order_id: string | number
): Promise<OrderProduct> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<OrderProduct> = await conn.query(
			orderProductsRemoveQuery,
			[order_id]
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`order_product with id: ${order_id} can not be removed: ${err}`
		);
	}
};
