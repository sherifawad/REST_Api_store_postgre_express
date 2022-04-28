import { Category, Order, Product, User } from "./interface";

export type Result<T> = {
	[Key in keyof T]: () => T[Key];
};

export type Res<T> = {
	[Key in keyof T]: (val: T[Key]) => string;
};

export type CategoryQuery = Partial<Record<keyof Category, Category>>;

export type UserQuery = Partial<Record<keyof User, User>>;

export type ProductQuery = Partial<Record<keyof Product, Product>>;

export type OrderQuery = Partial<Record<keyof Order, Order>>;
