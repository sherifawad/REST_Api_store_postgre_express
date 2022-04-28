CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(255) Not Null Unique,
    description text,
    price NUMERIC(9,2) NOT NULL DEFAULT 0,
    category_id INT,
	FOREIGN KEY (category_id) REFERENCES categories (id)
);