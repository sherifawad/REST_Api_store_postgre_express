import { PoolClient, QueryResult } from "pg";
import { Category, Order, Product, User } from "./interface";

export type GetOneResult = <T>(
	sql: string,
	id: number | string
) => Promise<Gen<T>>;

export type AcceptableParams<T> = keyof T;

export type PostgresQueryResult = <T>(
	connection: PoolClient,
	sql: string,
	params?: AcceptableParams<T>[]
) => Promise<QueryResult<Gen<T>>>;

export type GetManyResults = <T>(
	connection: PoolClient,
	sql: string
) => Promise<{ body: Gen<T>[] }>;

export type Result<T> = {
	[Key in keyof T]: () => T[Key];
};

export type Gene<T> = {
	[Key in keyof T]: (val: T[Key]) => TDataType<keyof T>;
};

export type Gen<T> = {
	[Key in keyof T]?: T[Key];
};

export type Res<T> = {
	[Key in keyof T]: (val: T[Key]) => string;
};

export type Re<T> = {
	[Key in keyof T]: Partial<Record<keyof T, T[Key]>>;
};

export type ExtendedOrder = Order &
	Product & {
		user_id: number;
		order_id: number;
	};

export type CategoryQuery = Gen<Category>;

export type UserQuery = Gen<User>;

// export type ProductQuery = Partial<Record<keyof Product, Product>>;
export type ProductQuery = Gen<Product>;

// export type OrderQuery = Partial<Record<keyof Order, Order>>;
export type OrderQuery = Gen<Order>;

export interface TDataType<T> {
	[key: string]: T;
}

export type TType<T> = {
	[Key in keyof T]: T;
};
