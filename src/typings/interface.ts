export interface User {
	id: number;
	email: string;
	active: boolean;
	firstname: string;
	lastname: string;
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
	category_id?: number;
	category?: Category;
}

export interface Order {
	id: number;
	date: Date;
	user: User;
	quantity: number;
	products: Product[];
}
