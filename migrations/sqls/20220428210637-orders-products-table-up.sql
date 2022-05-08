Create Table IF NOT EXISTS  orders_products (
    order_product_quantity INT NOT NULL DEFAULT 1,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE, 
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    CONSTRAINT order_product_id PRIMARY KEY (order_id, product_id)
);