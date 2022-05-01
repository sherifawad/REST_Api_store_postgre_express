export interface User {
	user_id: number;
	user_email: string;
	user_active: boolean;
	user_firstname: string;
	user_lastname: string;
	user_password: string;
	orders?: Order[];
}

export interface Category {
	category_id: number;
	category_name: string;
	category_description?: string;
}

export interface Product {
	product_id: number;
	product_name: string;
	product_description?: string;
	product_price: string;
	category_id?: number;
	category?: Category;
}

export interface OrderProduct extends Product {
	order_product_id: number;
	orderId: Order;
	order_product_quantity: number;
}
export interface Order {
	order_id: number;
	order_date?: Date;
	user_id: number;
	user?: User;
	order_products: OrderProduct[];
}
