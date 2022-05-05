import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Category } from "../typings/interface";
import { CategoryQuery } from "../typings/types";
import { createInsert, createPatch, queryPrepare } from "../utils/db";
import {
	categoryIndexQuery,
	categoryProductsShowQuery,
	categoryRemoveQuery,
	categoryShowQuery,
	checkCategoryExistQuery
} from "./queries/categoryQueries";

export const categoryIndex = async (): Promise<Category[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<Category> = await conn.query(
			categoryIndexQuery
		);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`categories index : ${err}`);
	}
};

export const categoryShow = async (
	category_id: string | number
): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<Category> = await conn.query(
			categoryShowQuery,
			[category_id]
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Category with id: ${category_id} does not exist: ${err}`
		);
	}
};

export const checkCategoryExist = async (
	category_id: string | number
): Promise<boolean> => {
	try {
		const conn: PoolClient = await client.connect();
		const result = await conn.query(checkCategoryExistQuery, [category_id]);
		conn.release();
		if (result.rows[0]) return true;
	} catch (err) {
		return false;
	}
	return false;
};

export const categoryProductsShow = async (
	category_id: string | number
): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();

		const result = await conn.query(categoryProductsShowQuery, [
			category_id
		]);
		conn.release();
		return {
			category_id: result.rows[0].category_id,
			category_name: result.rows[0].category_name,
			category_description: result.rows[0].category_description,
			category_products: result.rows.map(productRow => ({
				product_id: productRow.product_id,
				product_name: productRow.product_name,
				product_description: productRow.product_description,
				product_price: productRow.product_price
			}))
		};
	} catch (err) {
		throw new Error(
			`Category with id: ${category_id} does not exist: ${err}`
		);
	}
};

export const categoryCreate = async ({
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
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not created: ${err}`);
	}
};

export const categoryPatch = async ({
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
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Category not patched: ${err}`);
	}
};

export const categoryRemove = async (
	category_id: string | number
): Promise<Category> => {
	try {
		const conn: PoolClient = await client.connect();
		const result: QueryResult<Category> = await conn.query(
			categoryRemoveQuery,
			[category_id]
		);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(
			`Category with id: ${category_id} can not be removed: ${err}`
		);
	}
};
