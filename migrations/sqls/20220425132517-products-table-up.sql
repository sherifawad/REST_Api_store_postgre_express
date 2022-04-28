CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(255) Not Null Unique,
    description text,
    price numeric NOT NULL DEFAULT 0,
    CONSTRAINT category_id
    FOREIGN KEY(id) 
    REFERENCES categories(id)
);