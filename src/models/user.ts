import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { User } from "../typings/interface";
import { UserQuery } from "../typings/types";
import {
	createInsert,
	createInsertString,
	createPatch,
	createPatchString,
	queryPrepare
} from "../utils/db";

export const index = async (): Promise<UserQuery[]> => {
	try {
		const conn: PoolClient = await client.connect();
		const sql =
			"SELECT user_id, user_email, user_firstname, user_lastname FROM users  WHERE user_active";
		const result: QueryResult<UserQuery> = await conn.query(sql);
		conn.release();
		return result.rows;
	} catch (err) {
		throw new Error(`users index : ${err}`);
	}
};

export const show = async (user_id: string): Promise<User> => {
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

export const create = async ({
	user_email,
	user_firstname,
	user_lastname,
	user_password,
	user_active
}: UserQuery): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();
		// TODO: implement jwt authentication
		const out = queryPrepare<User>({
			user_email,
			user_firstname,
			user_lastname,
			user_password,
			user_active
		});

		const sql = createInsert("users", out.keys);
		const result: QueryResult<User> = await conn.query(sql, out.values);

		// const sql = createInsertString<User>("user_id", {
		// 	...(user_email && { user_email }),
		// 	...(user_firstname && { user_firstname }),
		// 	...(user_lastname && { user_lastname }),
		// 	...(user_password && { user_password }),
		// 	...(user_active && { user_active })
		// });
		// const inputs = [];
		// if (user_email) inputs.push(user_email);
		// if (user_firstname) inputs.push(user_firstname);
		// if (user_lastname) inputs.push(user_lastname);
		// if (user_password) inputs.push(user_password);
		// if (user_active) inputs.push(user_active);
		// const result = await conn.query(sql, inputs);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`user not created: ${err}`);
	}
};

export const patch = async ({
	user_id,
	user_email,
	user_firstname,
	user_lastname,
	user_password,
	user_active
}: UserQuery): Promise<User> => {
	try {
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<User>({
			user_id,
			user_email,
			user_firstname,
			user_lastname,
			user_password,
			user_active
		});
		const sql = createPatch("user_id", "users", `${user_id}`, out.keys);

		const result = await conn.query(sql, out.values);

		// const sql = createPatchString<User>("user_id", "users", `${user_id}`, {
		// 	...(user_email && { user_email }),
		// 	...(user_firstname && { user_firstname }),
		// 	...(user_lastname && { user_lastname }),
		// 	...(user_password && { user_password }),
		// 	...(user_active && { user_active })
		// });
		// const inputs = [];
		// if (user_email) inputs.push(user_email);
		// if (user_firstname) inputs.push(user_firstname);
		// if (user_lastname) inputs.push(user_lastname);
		// if (user_password) inputs.push(user_password);
		// if (user_active) inputs.push(user_active);
		// const result = await conn.query(sql, inputs);
		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`User not patched: ${err}`);
	}
};

// we won't delete the user so we set user active status to false
export const deActivate = async (user_id: string): Promise<User> => {
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

// export const Remove = async (user_id: string): Promise<User> => {
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
