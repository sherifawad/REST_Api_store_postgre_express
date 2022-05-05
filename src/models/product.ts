import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Product } from "../typings/interface";
import { ProductQuery } from "../typings/types";
import { createInsert, createPatch, queryPrepare } from "../utils/db";

export const productIndex = async (): Promise<Product[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT * FROM products`;
		const result: QueryResult<Product> = await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const productShow = async (
	product_id: string | number
): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT products.*, 
        categories.* 
        FROM products INNER JOIN categories 
        ON products.category_id = categories.category_id 
        WHERE products.product_id=($1);`;
		const result = await conn.query(sql, [product_id]);
		conn.release();
		return result.rows.map(row => ({
			product_id: row.product_id,
			product_name: row.product_name,
			product_description: row.product_description,
			product_price: row.product_price,
			...(row.category_id && {
				category_id: row.category_id,
				category: {
					category_id: row.category_id,
					category_name: row.category_name,
					category_description: row.category_description
				}
			})
		}))[0];
	} catch (err) {
		throw new Error(
			`Product with id: ${product_id} does not exist: ${err}`
		);
	}
};

export const checkProductExist = async (
	product_id: string | number
): Promise<boolean> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT 1 FROM products WHERE product_id=($1) LIMIT 1;`;
		// const sql = `SELECT product_id FROM products WHERE product_id=($1);`;
		const result = await conn.query(sql, [product_id]);
		conn.release();
		if (result.rows[0]) return true;
	} catch (err) {
		return false;
	}
	return false;
};

export const productCreate = async ({
	product_name,
	product_description,
	product_price,
	category_id
}: ProductQuery): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const out = queryPrepare<Product>({
			product_name,
			product_description,
			product_price,
			category_id
		});

		const sql = createInsert("products", out.keys);
		const result: QueryResult<Product> = await conn.query(sql, out.values);

		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Product not created: ${err}`);
	}
};

export const productPatch = async ({
	product_id,
	product_name,
	product_description,
	product_price,
	category_id
}: ProductQuery): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<Product>({
			product_id,
			product_name,
			product_description,
			product_price,
			category_id
		});
		const sql = createPatch(
			"product_id",
			"products",
			`${product_id}`,
			out.keys
		);

		const result = await conn.query(sql, out.values);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Product not patched: ${err}`);
	}
};

export const productRemove = async (
	product_id: string | number
): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "DELETE FROM products WHERE product_id=($1)";
		const result: QueryResult<Product> = await conn.query(sql, [
			product_id
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Product with id: ${product_id} can not be removed: ${err}`
		);
	}
};
