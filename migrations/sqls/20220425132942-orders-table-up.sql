Create Table orders (
  id Serial Primary Key,
  date date NOT NULL DEFAULT NOW(),
    CONSTRAINT user_id
    FOREIGN KEY(id) 
    REFERENCES users(id)
);