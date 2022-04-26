CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(255) Not Null Unique,
    description? text,
    price numeric NOT NULL DEFAULT 0,
    CONSTRAINT categoryId
    FOREIGN KEY(id) 
    REFERENCES categories(id)
);