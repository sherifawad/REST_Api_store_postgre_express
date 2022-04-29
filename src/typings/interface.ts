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
	price: string;
	category_id?: number;
	category?: Category;
}

export interface OrderProduct {
	id: number;
	quantity: number;
	order_id: number;
	product_id: number;
}
export interface Order {
	id: number;
	date?: Date;
	user_id: number;
	user?: User;
	products?: OrderProduct[];
}
