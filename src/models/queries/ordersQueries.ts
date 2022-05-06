export const ordersIndexQuery = "SELECT * FROM orders";
export const orderShowQuery = "SELECT * FROM orders WHERE order_id=($1)";

export const orderProductsQuery =
	"SELECT * FROM orders_products WHERE order_id=($1)";

export const orderRemoveQuery = "DELETE FROM orders WHERE order_id=($1)";
