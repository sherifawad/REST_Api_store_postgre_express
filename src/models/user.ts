import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { User } from "../typings/interface";

export const index = async (): Promise<User[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT id, firstName, lastName FROM users  WHERE active=true";
		const result: QueryResult<User> = await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`users index : ${err}`);
	}
};

export const show = async (id: string): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT id, email, firstName, lastName FROM users WHERE id=($1)";
		const result: QueryResult<User> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user with id: ${id} does not exist: ${err}`);
	}
};

export const create = async ({
	email,
	firstName,
	lastName,
	password
}: User): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"INSERT INTO users (email, firstName, lastName, password) VALUES($1, $2, $3, $4) RETURNING *";
		// TODO: implement jwt authentication
		const result = await conn.query(sql, [
			email,
			firstName,
			lastName,
			password
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user not created: ${err}`);
	}
};

// we won't delete the user so we set user active status to false
export const deActivate = async (id: string): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "UPDATE orders SET active = false WHERE id = $1";
		const result: QueryResult<User> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user with id: ${id} can not be removed: ${err}`);
	}
};

// export const Remove = async (id: string): Promise<User> => {
// 	try {
// 		const conn: PoolClient = await client.connect();
// 		const sql = "DELETE FROM users WHERE id=($1)";
// 		const result: QueryResult<User> = await conn.query(sql, [id]);
// 		conn.release();
// 		return result.rows[0];
// 	} catch (err) {
// 		throw new Error(`user with id: ${id} can not be removed: ${err}`);
// 	}
// };
