import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { createInsertString } from "../utils/db";

export const index = async (): Promise<OrderQuery[]> => {
	try {
		const conn: PoolClient = await client.connect();

		const productsSql = ` 
                    SELECT op.*, p.*, c.*
                    FROM orders_products As op 
                    INNER JOIN products As p
                    ON op.product_id = p.product_id
                    INNER JOIN categories As c
                    ON p.category_id = c.category_id;`;

		const sql = `
                    SELECT o.*, u.*
                    FROM orders As o
                    INNER JOIN users As u 
                    ON o.user_id = u.user_id;`;

		// const sql = `SELECT * FROM orders`;
		const productsResult: QueryResult<OrderProduct> = await conn.query(
			productsSql
		);

		const result = await conn.query(sql);
		conn.release();

		const data = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: row.order_date,
			user_id: row.user_id,
			User: {
				user_id: row.user_id,
				user_email: row.user_email,
				user_firstname: row.user_firstname,
				user_lastname: row.user_lastname
			},
			products: productsResult.rows.map(productRow => ({
				order_product_id: row.order_product_id,
				order_id: row.id,
				order_product_quantity: productRow.order_product_quantity,
				product_id: productRow.product_id
			}))
		}));
		console.log(
			"🚀 ~ file: order.ts ~ line 59 ~ index ~ data",
			JSON.stringify(data)
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
	order_date,
	order_products
}: OrderQuery): Promise<Order> => {
	try {
		const conn: PoolClient = await client.connect();
		const sqlOrderTable = createInsertString<Order>("orders", {
			...(user_id && { user_id }),
			...(order_date && { order_date })
		});
		const sqlOrderTableInputs = [];
		if (user_id) sqlOrderTableInputs.push(user_id);
		if (order_date) sqlOrderTableInputs.push(order_date);

		const result: QueryResult<Order> = await conn.query(
			sqlOrderTable,
			sqlOrderTableInputs
		);

		(order_products as unknown as OrderProduct[]).forEach(async product => {
			const sqlOrdersProductsTable = createInsertString<unknown>(
				"orders_products",
				{
					...(product.order_product_quantity && {
						quantity: `${product.order_product_quantity}`
					}),
					...{
						product_id: `${product.product_id}`
					},
					...(result.rows[0].order_id && {
						order_id: `${result.rows[0].order_id}`
					})
				}
			);

			const sqlOrdersProductsTableInputs = [];
			if (product.order_product_quantity)
				sqlOrdersProductsTableInputs.push(
					product.order_product_quantity
				);

			sqlOrdersProductsTableInputs.push(product.product_id);

			if (result.rows[0].order_id)
				sqlOrdersProductsTableInputs.push(result.rows[0].order_id);

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
