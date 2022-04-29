import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { createInsertString } from "../utils/db";

export const index = async (): Promise<OrderQuery[]> => {
	try {
		const conn: PoolClient = await client.connect();
		// const sql = `SELECT orders.*,
		//  users.id As user_id, users.email As user_email, users.firstname As user_firstname, users.lastname As user_lastname,
		//   orders_products.quantity As orders_products_quantity,
		//    products.id As products_id, products.name As products_name, products.description As products_description, products.price As products_price
		//     FROM orders INNER JOIN users ON orders.user_id = users.id
		//      INNER JOIN orders_products ON orders_products.order_id = orders.id
		//       INNER JOIN products ON orders_products.product_id = products.id;`;

		// const sql = ` SELECT p.id As p_id, p.name As p_name, p.price As p_price, MAX(op.quantity) as op_quantity
		//             FROM orders_products As op
		//             INNER JOIN products As p ON op.product_id = p.id
		//             GROUP BY p.id`;

		const sql = ` SELECT p.id As p_id, p.name As p_name, p.price As p_price, MAX(op.quantity) as op_quantity
                    FROM orders_products As op
		            INNER JOIN products As p ON op.product_id = p.id
		            GROUP BY p.id INNER JOIN orders As o ON op.order_id = o.id`;

		// const sql = `Select op.quantity  As op_quantity
		// FROM orders_products As op
		// INNER join (SELECT p.id As p_id, p.name As p_name, p.price As p_price
		//               FROM products As p
		//               GROUP BY id) As c
		//               ON op.product_id = p.id`;

		// const sql = `SELECT orders_products.*,
		// MAX(users.id) As user_id, MAX(users.email) As user_email,MAX(users.firstname) As user_firstname, MAX(users.lastname) As user_lastname,
		// MAX(products.id) As products_id, MAX(products.name) As products_name, MAX(products.description) As products_description, MAX(products.price) As products_price
		//         FROM orders_products INNER JOIN orders ON orders_products.order_id = orders.id
		//          INNER JOIN users ON orders.user_id = users.id
		//            INNER JOIN products ON orders_products.product_id = products.id
		//             GROUP BY orders_products.id;`;

		// const sql = `SELECT * FROM orders`;
		const result = await conn.query(sql);
		conn.release();
		console.log(
			"🚀 ~ file: order.ts ~ line 21 ~ index ~ result",
			result.rows
		);
		return result.rows.map(row => ({
			id: row.id,
			date: row.date,
			user_id: row.user_id,
			quantity: row.orders_products_quantity,
			order_id: row.id,
			product_id: row.products_id,
			User: {
				id: row.user_id,
				email: row.user_email,
				firstname: row.user_firstname,
				lastname: row.user_lastname
			}
		}));
	} catch (err) {
		throw new Error(`orders index : ${err}`);
	}
};

export const create = async ({
	user_id,
	products
}: OrderQuery): Promise<Order> => {
	try {
		const conn: PoolClient = await client.connect();
		const sqlOrderTable = createInsertString<unknown>("orders", {
			...(user_id && { user_id: `${user_id}` })
		});
		const sqlOrderTableInputs = [];
		if (user_id) sqlOrderTableInputs.push(user_id);

		const result: QueryResult<Order> = await conn.query(
			sqlOrderTable,
			sqlOrderTableInputs
		);

		(products as unknown as OrderProduct[]).forEach(async product => {
			const sqlOrdersProductsTable = createInsertString<unknown>(
				"orders_products",
				{
					...(product.quantity && {
						quantity: `${product.quantity}`
					}),
					...{
						product_id: `${product.product_id}`
					},
					...(result.rows[0].id && {
						order_id: `${result.rows[0].id}`
					})
				}
			);

			const sqlOrdersProductsTableInputs = [];
			if (product.quantity)
				sqlOrdersProductsTableInputs.push(product.quantity);

			sqlOrdersProductsTableInputs.push(product.product_id);

			if (result.rows[0].id)
				sqlOrdersProductsTableInputs.push(result.rows[0].id);

			await conn.query(
				sqlOrdersProductsTable,
				sqlOrdersProductsTableInputs
			);
		});

		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
	}
};
