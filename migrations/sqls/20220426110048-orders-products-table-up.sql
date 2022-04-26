Create Table orders_products (
  id Serial Primary Key,
  quantity numeric NOT NULL DEFAULT 1,
    CONSTRAINT orderId
    FOREIGN KEY(id) 
    REFERENCES orders(id),
    CONSTRAINT productId
    FOREIGN KEY(id) 
    REFERENCES products(id)
);