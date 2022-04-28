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

console.log("🚀 ~ file: connection.ts ~ line 13 ~ ENV", ENV);

const client = new Pool({
	host: POSTGRES_HOST,
	database: ENV === "test" ? POSTGRES_TEST_DB : POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD
});

console.log("🚀 ~ file: connection.ts ~ line 25 ~ client", client);
export default client;
