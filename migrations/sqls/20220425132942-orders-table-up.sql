Create Table orders (
  id Serial Primary Key,
  date date NOT NULL DEFAULT NOW(),
    CONSTRAINT userId
    FOREIGN KEY(id) 
    REFERENCES users(id)
);