import { PoolClient } from "pg";
import {
	AcceptableParams,
	Gen,
	GetManyResults,
	PostgresQueryResult
} from "../typings/types";

// https://stackoverflow.com/questions/21759852/easier-way-to-update-data-with-node-postgres
export const createPatchString = <T>(
	idColumnName: string,
	tableName: string,
	id: string,
	cols: Gen<T>
): string => {
	// Setup static beginning of query
	const query = [`UPDATE ${tableName}`];
	query.push("SET");

	// Create another array storing each set command
	// and assigning a number value for parameterized query
	const set: string[] = [];
	Object.keys(cols).forEach((key, i) => {
		set.push(`${key} = ($${i + 1})`);
	});
	query.push(set.join(", "));

	// Add the WHERE statement to look up by id
	query.push(`WHERE ${idColumnName} = ${id}`);
	// return patched data
	query.push(" RETURNING *");

	// Return a complete query string
	return query.join(" ");
};

export const createInsertString = <T>(
	tableName: string,
	cols: Gen<T>
): string => {
	// Setup static beginning of query
	const query = [`INSERT INTO ${tableName} (`];
	const keys: string[] = [];
	const values: string[] = [];

	Object.keys(cols).forEach((key, i) => {
		keys.push(`${key}`);
		values.push(`$${i + 1}`);
	});
	query.push(keys.join(", "));
	query.push(")");

	query.push("VALUES (");
	query.push(values.join(", "));
	query.push(")");
	// return patched data
	query.push(" RETURNING *");

	// Return a complete query string
	return query.join(" ");
};

export const createPatch = (
	idColumnNames: string[],
	tableName: string,
	ids: string[],
	keys: string[]
): string | undefined => {
	if (idColumnNames.length !== ids.length) {
		return undefined;
	}
	// Setup static beginning of query
	const query = [`UPDATE ${tableName}`];
	query.push("SET");

	// Create another array storing each set command
	// and assigning a number value for parameterized query
	const set: string[] = [];
	keys.forEach((key, i) => {
		set.push(`${key} = ($${i + 1})`);
	});
	query.push(set.join(", "));

	// Add the WHERE statement to look up by id
	// query.push(`WHERE ${idColumnName} = ${id}`);

	query.push("WHERE");
	idColumnNames.forEach((name, i) => {
		query.push(`${name} = ${ids[i]}`);
		if (i !== idColumnNames.length - 1) {
			query.push(" AND ");
		}
	});
	// return patched data
	query.push("RETURNING *");

	// Return a complete query string
	return query.join(" ");
};

export const queryPrepare = <T>(params: Gen<T>) => {
	const keys: string[] = [];
	const values: unknown[] = [];

	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			keys.push(key);
			values.push(value);
		}
	});

	return {
		keys,
		values
	};
};

export const createInsert = (tableName: string, keys: string[]): string => {
	// Setup static beginning of query
	const query = [`INSERT INTO ${tableName} (`];
	const values: string[] = [];

	keys.forEach((key, i) => {
		values.push(`$${i + 1}`);
	});
	query.push(keys.join(", "));
	query.push(")");

	query.push("VALUES (");
	query.push(values.join(", "));
	query.push(")");
	// return patched data
	query.push(" RETURNING *");

	// Return a complete query string
	return query.join(" ");
};

const query: PostgresQueryResult = <T>(
	connection: PoolClient,
	sql: string,
	params?: AcceptableParams<T>[]
) => connection.query(sql, params);

export const getOne = async <T>(
	connection: PoolClient,
	sql: string,
	id: number | string
) => {
	const { rows } = await query(connection, sql, [id]);
	return <Gen<T>>rows[0];
};

export const getMany: GetManyResults = async (
	connection: PoolClient,
	sql: string
) => {
	const { rows } = await query(connection, sql);
	return {
		body: rows
	};
};
