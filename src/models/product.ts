import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Product } from "../typings/interface";
import { createPatchString } from "../utils/db";

export const index = async (): Promise<Product[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT products.*, categories.name AS "categoryName" FROM products INNER JOIN categories ON products.categoryId = categories.id;`;
		const result: QueryResult<Product> = await conn.query(sql);
		conn.release();
		return result.rows.map(row => ({
			id: row.id,
			name: row.name,
			description: row.description,
			price: row.price,
			...(row.categoryId && {
				category: {
					id: row.categoryId,
					name: row.category?.name as string
				}
			})
		}));
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const show = async (id: string): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT products.*, categories.name AS "categoryName" FROM products INNER JOIN categories ON products.categoryId = categories.id WHERE products.id = ${id};`;
		const result: QueryResult<Product> = await conn.query(sql, [id]);
		conn.release();
		return result.rows.map(row => ({
			id: row.id,
			name: row.name,
			description: row.description,
			price: row.price,
			...(row.categoryId && {
				category: {
					id: row.categoryId,
					name: row.category?.name as string
				}
			})
		}))[0];
	} catch (err) {
		throw new Error(`Product with id: ${id} does not exist: ${err}`);
	}
};

export const create = async ({
	name,
	description,
	price,
	categoryId
}: Product): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"INSERT INTO products (name, description, price, categoryId) VALUES($1, $2, $3, $4) RETURNING *";
		const result = await conn.query(sql, [
			name,
			description || null,
			price,
			categoryId || null
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Product not created: ${err}`);
	}
};

export const patch = async ({
	id,
	name,
	description,
	price,
	categoryId
}: Product): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = createPatchString<unknown>("categories", `${id}`, {
			...(name && { name: `${name}` }),
			...(description && { description: `${description}` }),
			...(price && { price: `${price}` }),
			...(categoryId && { categoryId: `${categoryId}` })
		});
		const result = await conn.query(sql, [
			name,
			description,
			price,
			categoryId
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Product not patched: ${err}`);
	}
};

export const Remove = async (id: string): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "DELETE FROM products WHERE id=($1)";
		const result: QueryResult<Product> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Product with id: ${id} can not be removed: ${err}`);
	}
};
