import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Category } from "../typings/interface";
import { CategoryQuery } from "../typings/types";
import {
	createInsert,
	createInsertString,
	createPatch,
	createPatchString,
	queryPrepare
} from "../utils/db";

export const index = async (): Promise<Category[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "SELECT * FROM categories";
		const result: QueryResult<Category> = await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const show = async (category_id: string): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "SELECT * FROM categories WHERE category_id=($1)";
		const result: QueryResult<Category> = await conn.query(sql, [
			category_id
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Category with id: ${category_id} does not exist: ${err}`
		);
	}
};

export const create = async ({
	category_name,
	category_description
}: CategoryQuery): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const out = queryPrepare<Category>({
			category_name,
			category_description
		});

		const sql = createInsert("categories", out.keys);
		const result: QueryResult<Category> = await conn.query(sql, out.values);
		// const sql = createInsertString<Category>("categories", {
		// 	...(category_name && { category_name }),
		// 	...(category_description && {
		// 		category_description
		// 	})
		// });
		// const inputs = [];
		// if (category_name) inputs.push(category_name);
		// if (category_description) inputs.push(category_description);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not created: ${err}`);
	}
};

export const patch = async ({
	category_id,
	category_name,
	category_description
}: CategoryQuery): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<Category>({
			category_name,
			category_description
		});
		const sql = createPatch(
			"category_id",
			"categories",
			`${category_id}`,
			out.keys
		);

		const result = await conn.query(sql, out.values);
		// const sql = createPatchString<Category>(
		// 	"category_id",
		// 	"categories",
		// 	`${category_id}`,
		// 	{
		// 		...(category_name && { category_name }),
		// 		...(category_description && { category_description })
		// 	}
		// );
		// const inputs = [];
		// if (category_name) inputs.push(category_name);
		// if (category_description) inputs.push(category_description);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not patched: ${err}`);
	}
};

export const Remove = async (category_id: string): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "DELETE FROM categories WHERE category_id=($1)";
		const result: QueryResult<Category> = await conn.query(sql, [
			category_id
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Category with id: ${category_id} can not be removed: ${err}`
		);
	}
};
