import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Category, Product } from "../typings/interface";
import { ProductQuery } from "../typings/types";
import { createInsertString, createPatchString } from "../utils/db";

export const index = async (): Promise<Product[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT * FROM products`;
		const result: QueryResult<Product> = await conn.query(sql);
		conn.release();
		return result.rows.map(row => ({
			id: row.id,
			name: row.name,
			description: row.description,
			price: row.price,
			category_id: row.category_id
		}));
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const show = async (id: string): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = `SELECT products.*, categories.name As category_name, categories.description As category_description FROM products INNER JOIN categories ON products.category_id = categories.id WHERE products.id=($1);`;
		const result = await conn.query(sql, [id]);
		conn.release();
		return result.rows.map(row => ({
			id: row.id,
			name: row.name,
			description: row.description,
			price: row.price,
			...(row.category_id && {
				category_id: row.category_id,
				category: {
					id: row.category_id,
					name: row.category_name,
					description: row.category_description
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
	category_id
}: ProductQuery): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = createInsertString<unknown>("products", {
			...(name && { name: `${name}` }),
			...(description && { description: `${description}` }),
			...(price && { price: `${price}` }),
			...(category_id && { category_id: `${category_id}` })
		});
		const inputs = [];
		if (name) inputs.push(name);
		if (description) inputs.push(description);
		if (price) inputs.push(price);
		if (category_id) inputs.push(category_id);

		const result: QueryResult<Product> = await conn.query(sql, inputs);
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
	category_id
}: ProductQuery): Promise<Product> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = createPatchString<unknown>("products", `${id}`, {
			...(name && { name: `${name}` }),
			...(description && { description: `${description}` }),
			...(price && { price: `${price}` }),
			...(category_id && { category_id: `${category_id}` })
		});
		const inputs = [];
		if (name) inputs.push(name);
		if (description) inputs.push(description);
		if (price) inputs.push(price);
		if (category_id) inputs.push(category_id);
		const result = await conn.query(sql, inputs);
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
