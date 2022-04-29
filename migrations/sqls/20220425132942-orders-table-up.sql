Create Table orders (
    id Serial Primary Key,
    date date NOT NULL DEFAULT NOW(),
    user_id INT Not Null,
	FOREIGN KEY (user_id) REFERENCES users (id)
);