Create Table orders (
    order_id Serial Primary Key,
    order_date date NOT NULL DEFAULT NOW(),
    user_id INT Not Null,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
);