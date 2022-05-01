Create Table orders_products (
    order_product_id Serial Primary Key,
    order_product_quantity numeric NOT NULL DEFAULT 1,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE, 
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);