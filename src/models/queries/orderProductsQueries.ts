export const orderProductShowQuery =
	"SELECT * FROM orders_products WHERE orders_products_id=($1)";

export const orderProductsDetailsQuery = `SELECT * 
    FROM orders_products As op 
    INNER JOIN products As p 
    ON op.product_id = p.product_id 
    INNER JOIN categories As c 
    ON p.category_id = c.category_id 
    WHERE op.order_id=($1) ORDER BY op.order_product_id`;

export const orderProductsQuery =
	"SELECT * FROM orders_products WHERE order_id=($1)";

export const orderProductsRemoveQuery =
	"DELETE FROM orders_products WHERE order_id=($1)";

export const orderProductRemoveOPQuery =
	"DELETE FROM orders_products WHERE orders_products_id=($1)";
