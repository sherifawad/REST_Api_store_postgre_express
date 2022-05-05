export const productIndexQuery = "SELECT * FROM products";
export const productShowQuery = `SELECT products.*, 
categories.* 
FROM products INNER JOIN categories 
ON products.category_id = categories.category_id 
WHERE products.product_id=($1);`;
export const checkProductExistQuery =
	"SELECT 1 FROM products WHERE product_id=($1) LIMIT 1;";
export const categoryProductsShowQuery = `SELECT c.*, p.*
FROM categories AS c
INNER JOIN products As p
ON c.category_id=p.category_id
WHERE c.category_id=($1) 
ORDER BY p.product_id;`;
export const productRemoveQuery = "DELETE FROM products WHERE product_id=($1)";
