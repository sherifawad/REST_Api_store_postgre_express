import { PoolClient, QueryResult } from "pg";
import client from "../services/connection";
import { Order, OrderProduct } from "../typings/interface";
import { OrderQuery } from "../typings/types";
import { createInsert, queryPrepare } from "../utils/db";

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

		const data: Order[] = result.rows.map(row => ({
			order_id: row.order_id,
			order_date: row.order_date,
			user_id: row.user_id,
			user: {
				user_id: row.user_id,
				user_email: row.user_email,
				user_firstname: row.user_firstname,
				user_lastname: row.user_lastname,
				user_active: row.user_active
			},
			order_products: productsResult.rows.map(productRow => ({
				order_product_id: productRow.order_product_id,
				order_id: productRow.order_id,
				order_product_quantity: parseInt(
					productRow.order_product_quantity as unknown as string,
					10
				),
				product_id: productRow.product_id,
				product_name: productRow.product_name,
				product_description: productRow.product_description,
				product_price: productRow.product_price,
				user_id: row.user_id
			}))
		}));
		return data;
	} catch (err) {
		throw new Error(`orders index : ${err}`);
	}
};

export const create = async ({
	user_id,
	order_date,
	order_products
}: OrderQuery): Promise<Omit<Order, "order_products">> => {
	try {
		const conn: PoolClient = await client.connect();

		const out = queryPrepare<Order>({
			user_id,
			order_date
		});

		const sql = createInsert("orders", out.keys);
		const result: QueryResult<Order> = await conn.query(sql, out.values);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { order_id } = result.rows[0];
		if (!order_id) {
			throw new Error("orders Creation Error");
		}

		(order_products as OrderProduct[]).forEach(async product => {
			const OutOrderProduct = queryPrepare<OrderProduct>({
				order_id,
				product_id: product.product_id,
				order_product_quantity: product.order_product_quantity
			});

			const SqlOrderProduct = createInsert(
				"orders_products",
				OutOrderProduct.keys
			);
			await conn.query(SqlOrderProduct, OutOrderProduct.values);
		});

		conn.release();
		return result.rows[0];
	} catch (err) {
		throw new Error(`Order not created: ${err}`);
	}
};
