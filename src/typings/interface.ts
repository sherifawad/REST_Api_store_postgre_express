export interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface Category {
	id: number;
	name: string;
	description?: string;
}

export interface Product {
	id: number;
	name: string;
	description?: string;
	price: number;
	categoryId?: number;
	category?: Category;
}
