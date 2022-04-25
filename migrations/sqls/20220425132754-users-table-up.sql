Create Table users (
  id Serial Primary key,
  email  VarChar(100)  Not Null Unique,
  firstName VarChar(100) Not Null,
  lastName VarChar(100) Not Null,
  password Text Not Null
);