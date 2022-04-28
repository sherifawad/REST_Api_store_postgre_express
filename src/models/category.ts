import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Category } from "../typings/interface";
import { CategoryQuery } from "../typings/types";
import { createPatchString } from "../utils/db";

export const index = async (): Promise<Category[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "SELECT id, name, description FROM categories";
		const result: QueryResult<Category> = await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const show = async (id: string): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT id, name, description FROM categories WHERE id=($1)";
		const result: QueryResult<Category> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category with id: ${id} does not exist: ${err}`);
	}
};

export const create = async ({
	name,
	description
}: CategoryQuery): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"INSERT INTO categories (name, description) VALUES($1, $2) RETURNING *";
		const result = await conn.query(sql, [name, description || null]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not created: ${err}`);
	}
};

export const patch = async ({
	id,
	name,
	description
}: Category): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = createPatchString<unknown>("categories", `${id}`, {
			...(name && { name: `${name}` }),
			...(description && { description: `${description}` })
		});
		const result = await conn.query(sql, [name, description]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not patched: ${err}`);
	}
};

export const Remove = async (id: string): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "DELETE FROM categories WHERE id=($1)";
		const result: QueryResult<Category> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category with id: ${id} can not be removed: ${err}`);
	}
};
