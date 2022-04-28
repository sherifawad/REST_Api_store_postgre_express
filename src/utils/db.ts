import { Res } from "../typings/types";

// https://stackoverflow.com/questions/21759852/easier-way-to-update-data-with-node-postgres
export const createPatchString = <T>(
	tableName: string,
	id: string,
	cols: Res<T>
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
	query.push(`WHERE id = ${id}`);
	// return patched data
	query.push(" RETURNING *");

	// Return a complete query string
	return query.join(" ");
};

export const createInsertString = <T>(
	tableName: string,
	cols: Res<T>
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
