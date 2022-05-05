import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { hashPasswordService } from "../services/userServices";
import { User } from "../typings/interface";
import { UserQuery } from "../typings/types";
import { createInsert, createPatch, queryPrepare } from "../utils/db";

export const userIndex = async (): Promise<
	Omit<User, "user_password" | "user_active">[]
> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT user_id, user_email, user_firstname, user_lastname FROM users WHERE user_active";
		const result: QueryResult<Omit<User, "user_password">> =
			await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`users index : ${err}`);
	}
};

export const userShow = async (user_id: string | number): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT user_id, user_email, user_firstname, user_lastname, user_password, user_active FROM users WHERE user_id=($1)";
		const result: QueryResult<User> = await conn.query(sql, [user_id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user with id: ${user_id} does not exist: ${err}`);
	}
};

export const userCreate = async ({
	user_email,
	user_firstname,
	user_lastname,
	user_password,
	user_active
}: Omit<User, "user_id">): Promise<Omit<User, "user_password">> => {
	try {
		const conn: PoolClient = await client.connect();
		const hashedPassword = await hashPasswordService(user_password);
		const out = queryPrepare<User>({
			user_email,
			user_firstname,
			user_lastname,
			user_password: hashedPassword,
			user_active
		});

		const sql = createInsert("users", out.keys);
		const result: QueryResult<User> = await conn.query(sql, out.values);
		conn.release();
		return result.rows.map(row => ({
			user_id: row.user_id,
			user_email: row.user_email,
			user_firstname: row.user_firstname,
			user_lastname: row.user_lastname,
			user_active: row.user_active
		}))[0];
	} catch (err) {
		throw new Error(`user not created: ${err}`);
	}
};

export const checkEmailExists = async (
	user_email: string
): Promise<boolean> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "SELECT 1 FROM users WHERE user_email=($1) LIMIT 1";
		const result = await conn.query(sql, [user_email]);
		conn.release();
		if (result.rows[0]) return true;
	} catch (err) {
		return false;
	}
	return false;
};

export const userPatch = async ({
	user_id,
	user_email,
	user_firstname,
	user_lastname,
	user_password,
	user_active
}: UserQuery): Promise<Omit<User, "user_password">> => {
	try {
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<User>({
			user_id,
			user_email,
			user_firstname,
			user_lastname,
			user_password: user_password
				? await hashPasswordService(user_password)
				: user_password,
			user_active
		});
		const sql = createPatch("user_id", "users", `${user_id}`, out.keys);

		const result: QueryResult<User> = await conn.query(sql, out.values);

		conn.release();
		return result.rows.map(row => ({
			user_id: row.user_id,
			user_email: row.user_email,
			user_firstname: row.user_firstname,
			user_lastname: row.user_lastname,
			user_active: row.user_active
		}))[0];
	} catch (err) {
		throw new Error(`User not patched: ${err}`);
	}
};

// we won't delete the user so we set user active status to false
export const userDeActivate = async (
	user_id: string | number
): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "UPDATE users SET user_active = false WHERE user_id = $1";
		const result: QueryResult<User> = await conn.query(sql, [user_id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user with id: ${user_id} can not be removed: ${err}`);
	}
};

// export const userRemove = async (user_id: string | number): Promise<User> => {
// 	try {
// 		const conn: PoolClient = await client.connect();
// 		const sql = "DELETE FROM users WHERE user_id=($1)";
// 		const result: QueryResult<User> = await conn.query(sql, [user_id]);
// 		conn.release();
// 		return result.rows[0];
// 	} catch (err) {
// 		throw new Error(`user with id: ${user_id} can not be removed: ${err}`);
// 	}
// };
