CREATE TABLE IF NOT EXISTS  products (
    product_id SERIAL PRIMARY  KEY,
    product_name VARCHAR(255) Not Null Unique,
    product_description text,
    product_price NUMERIC(9,2) NOT NULL DEFAULT 0,
    category_id INT,
	FOREIGN KEY (category_id) REFERENCES categories (category_id)
);