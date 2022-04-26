export interface User {
	id: number;
	email: string;
	active: boolean;
	firstName: string;
	lastName: string;
	password: string;
	orders?: Order[];
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

export interface Order {
	id: number;
	date: Date;
	user: User;
	quantity: number;
	products: Product[];
}
