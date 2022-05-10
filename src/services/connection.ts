import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
	POSTGRES_HOST,
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_TEST_DB,
	ENV
} = process.env;

// eslint-disable-next-line import/no-mutable-exports
let client = new Pool({
	host: POSTGRES_HOST,
	database: ENV === "test" ? POSTGRES_TEST_DB : POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD
});

export const handleError = (err: unknown) => {
	console.log(err);
	console.log("resetting connection");
	client.end();
	client = new Pool({
		host: POSTGRES_HOST,
		database: ENV === "test" ? POSTGRES_TEST_DB : POSTGRES_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	});
};

export default client;
