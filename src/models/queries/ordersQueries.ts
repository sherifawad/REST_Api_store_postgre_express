export const ordersIndexQuery = "SELECT * FROM orders";
export const orderShowQuery = "SELECT * FROM orders WHERE order_id=($1)";
export const showOrderDetailsQuery = `SELECT op.*, p.*, c.* 
    FROM orders_products As op 
    INNER JOIN products As p 
    ON op.product_id = p.product_id 
    INNER JOIN categories As c 
    ON p.category_id = c.category_id 
    WHERE op.order_id=($1) 
    ORDER BY op.order_product_id;`;
export const orderRemoveQuery = "DELETE FROM orders WHERE order_id=($1)";
