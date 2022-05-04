/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express";
import {
	productCreate,
	productIndex,
	productPatch,
	productRemove,
	productShow
} from "../models/product";
import { Product } from "../typings/interface";

export const productViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { product_id } = req.params;
		if (!product_id) throw new Error("No product_id");
		const data: Product = await productShow(product_id);
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

export const productsViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const data: Product[] = await productIndex();
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

export const productAddController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const {
			product_name,
			product_description,
			product_price,
			category_id
		} = req.body;
		const data: Product = await productCreate({
			product_name,
			product_description,
			product_price,
			category_id
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

export const productUpdateController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const {
			product_name,
			product_description,
			product_price,
			category_id
		} = req.body;
		const { product_id } = req.params;
		if (!product_id) throw new Error("No product_id");
		const data = await productPatch({
			product_id: parseInt(product_id, 10),
			product_name,
			product_description,
			product_price,
			category_id: parseInt(category_id, 10)
		});
		if (!data) throw new Error("there are no data");
		return res.status(200).json({
			status: 200,
			message: "Updated Successfully",
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

export const productDeleteController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { product_id } = req.params;
		if (!product_id) throw new Error("No product_id");
		await productRemove(product_id);
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
