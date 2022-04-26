CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(255) Not Null Unique,
    description text,
    price integer NOT NULL,
    CONSTRAINT categoryId
    FOREIGN KEY(id) 
    REFERENCES categories(id)
);