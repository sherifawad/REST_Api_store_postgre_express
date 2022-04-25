Create Table orders (
  id Serial Primary Key,
  quantity integer Not Null,
    CONSTRAINT fk_user
    FOREIGN KEY(id) 
    REFERENCES users(id),
    CONSTRAINT fk_product
    FOREIGN KEY(id) 
    REFERENCES products(id)
);