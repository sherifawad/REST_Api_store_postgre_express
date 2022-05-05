export interface User {
	user_id: string | number;
	user_email: string;
	user_active: boolean;
	user_firstname: string;
	user_lastname: string;
	user_password: string;
	orders?: Order[];
}

export interface Category {
	category_id: string | number;
	category_name: string;
	category_description?: string;
	category_products?: Product[];
}

export interface Product {
	product_id: string | number;
	product_name: string;
	product_description?: string;
	product_price: string;
	category_id?: string | number;
	category?: Category;
}

export interface OrderProduct extends Product, Omit<Order, "order_products"> {
	order_product_id: string | number;
	order_product_quantity: number;
}
export interface Order {
	order_id: string | number;
	order_date?: string;
	user_id: string | number;
	user?: Omit<User, "user_password">;
	order_products: OrderProduct[];
}
