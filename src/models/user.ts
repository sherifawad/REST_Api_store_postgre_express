import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { User } from "../typings/interface";
import { UserQuery } from "../typings/types";
import { createPatchString } from "../utils/db";

export const index = async (): Promise<UserQuery[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT id, email, firstname, lastname FROM users  WHERE active";
		const result: QueryResult<UserQuery> = await conn.query(sql);
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
			"SELECT id, email, firstname, lastname, password, active FROM users WHERE id=($1)";
		const result: QueryResult<User> = await conn.query(sql, [id]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user with id: ${id} does not exist: ${err}`);
	}
};

export const create = async ({
	email,
	firstname,
	lastname,
	password
}: UserQuery): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"INSERT INTO users (email, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *";
		// TODO: implement jwt authentication
		const result = await conn.query(sql, [
			email,
			firstname,
			lastname,
			password
		]);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user not created: ${err}`);
	}
};

export const patch = async ({
	id,
	email,
	firstname,
	lastname,
	password,
	active
}: UserQuery): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = createPatchString<unknown>("users", `${id}`, {
			...(email && { email: `${email}` }),
			...(firstname && { firstname: `${firstname}` }),
			...(lastname && { lastname: `${lastname}` }),
			...(password && { password: `${password}` }),
			...(active && { active: `${active}` })
		});
		const inputs = [];
		if (email) inputs.push(email);
		if (firstname) inputs.push(firstname);
		if (lastname) inputs.push(lastname);
		if (password) inputs.push(password);
		if (active) inputs.push(active);
		const result = await conn.query(sql, inputs);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`User not patched: ${err}`);
	}
};

// we won't delete the user so we set user active status to false
export const deActivate = async (id: string): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql = "UPDATE users SET active = false WHERE id = $1";
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
