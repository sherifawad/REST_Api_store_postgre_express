CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(255) Not Null Unique,
    description text,
    CONSTRAINT fk_category
    FOREIGN KEY(id) 
    REFERENCES categories(id)
);