Create Table IF NOT EXISTS  users (
    user_id Serial Primary key,
    user_email  VarChar(100)  Not Null Unique,
    user_active  boolean not null default(true),
    user_firstname VarChar(100) Not Null,
    user_lastname VarChar(100) Not Null,
    user_password Text Not Null
);