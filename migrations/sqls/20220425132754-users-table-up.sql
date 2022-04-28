Create Table users (
  id Serial Primary key,
  email  VarChar(100)  Not Null Unique,
  active  boolean not null default(true),
  firstname VarChar(100) Not Null,
  lastname VarChar(100) Not Null,
  password Text Not Null
);