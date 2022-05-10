/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express";
import {
	orderCreate,
	orderIndex,
	orderPatch,
	orderRemove,
	showOrderDetails
} from "../models/order";
import { Order } from "../typings/interface";

export const orderViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { order_id } = req.params;
		if (!order_id) throw new Error("No order_id");
		const data: Order | undefined | void = await showOrderDetails(order_id);
		if (!data) throw new Error("there are no data");
		return res.status(200).json({
			status: 200,
			data
		});
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: error.stack
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};

export const ordersViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const data: Omit<Order, "order_products">[] | void = await orderIndex();
		if (!data) throw new Error("there are no data");
		return res.status(200).json({
			status: 200,
			data
		});
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: error.stack
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};

export const orderAddController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_id, order_date, order_products } = req.body;
		const data: Order | undefined | void = await orderCreate({
			user_id,
			order_date,
			order_products
		});
		if (!data) throw new Error("there are no data");

		return res.status(201).json({
			status: 201,
			message: "Created Successfully",
			data
		});
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: error.stack
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};

export const orderUpdateController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_id, order_date, order_products } = req.body;
		const { order_id } = req.params;
		if (!order_id) throw new Error("No order_id");
		await orderPatch({
			order_id: parseInt(order_id, 10),
			user_id,
			order_date,
			order_products
		});
		return res.status(200).json({
			status: 200,
			message: "Updated Successfully"
		});
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: error.stack
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};

export const orderDeleteController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { order_id } = req.params;
		if (!order_id) throw new Error("No order_id");
		await orderRemove(order_id);
		return res.status(200).json({
			status: 200,
			message: "Deleted Successfully"
		});
	} catch (error) {
		// check if instance of error not throw string but => throw new Error("")
		if (error instanceof Error) {
			return res.status(400).json({
				message: error.stack
			});
		}
		// error is string
		return res.status(500).json({
			message: `${error}`
		});
	}
};
