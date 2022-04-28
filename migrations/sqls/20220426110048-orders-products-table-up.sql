Create Table orders_products (
  id Serial Primary Key,
  quantity numeric NOT NULL DEFAULT 1,
    CONSTRAINT order_id
    FOREIGN KEY(id) 
    REFERENCES orders(id),
    CONSTRAINT product_id
    FOREIGN KEY(id) 
    REFERENCES products(id)
);