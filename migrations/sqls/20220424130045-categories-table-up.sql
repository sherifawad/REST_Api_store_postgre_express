CREATE TABLE categories (
    id SERIAL PRIMARY  KEY ,
    name VARCHAR(255) Not Null Unique,
    description text
);