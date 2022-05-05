export const userIndexQuery =
	"SELECT user_id, user_email, user_firstname, user_lastname FROM users WHERE user_active";
export const userShowQuery =
	"SELECT user_id, user_email, user_firstname, user_lastname, user_password, user_active FROM users WHERE user_id=($1)";
export const checkEmailExistQuery =
	"SELECT 1 FROM users WHERE user_email=($1) LIMIT 1;";
export const userDeActivateQuery =
	"UPDATE users SET user_active = false WHERE user_id = $1";
export const userRemoveQuery = "DELETE FROM users WHERE category_id=($1)";
