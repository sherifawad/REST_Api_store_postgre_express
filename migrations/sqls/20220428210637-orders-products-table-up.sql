Create Table orders_products (
    id Serial Primary Key,
    quantity numeric NOT NULL DEFAULT 1,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id), 
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id)
);