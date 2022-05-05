export const categoryIndexQuery = "SELECT * FROM categories";
export const categoryShowQuery =
	"SELECT * FROM categories WHERE category_id=($1)";
export const checkCategoryExistQuery =
	"SELECT 1 FROM categories WHERE category_id=($1) LIMIT 1;";
export const categoryProductsShowQuery = `SELECT c.*, p.*
FROM categories AS c
INNER JOIN products As p
ON c.category_id=p.category_id
WHERE c.category_id=($1) 
ORDER BY p.product_id;`;
export const categoryRemoveQuery =
	"DELETE FROM categories WHERE category_id=($1)";
