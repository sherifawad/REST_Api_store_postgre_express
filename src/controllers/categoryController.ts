/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express";
import {
	categoryCreate,
	categoryIndex,
	categoryPatch,
	categoryProductsShow,
	categoryRemove,
	categoryShow
} from "../models/category";
import { Category } from "../typings/interface";

export const categoryViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { category_id } = req.params;
		if (!category_id) throw new Error("No category_id");
		const data: Category | void = await categoryShow(category_id);
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

export const categoryProductsViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { category_id } = req.params;
		if (!category_id) throw new Error("No category_id");
		const data: Category | void = await categoryProductsShow(category_id);
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

export const categoriesViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const data: Category[] | void = await categoryIndex();
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

export const categoryAddController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { category_name, category_description } = req.body;
		const data: Category | void = await categoryCreate({
			category_name,
			category_description
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

export const categoryUpdateController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { category_name, category_description } = req.body;
		const { category_id } = req.params;
		if (!category_id) throw new Error("No category_id");
		const data = await categoryPatch({
			category_id: parseInt(category_id, 10),
			category_name,
			category_description
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

export const categoryDeleteController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { category_id } = req.params;
		if (!category_id) throw new Error("No category_id");
		await categoryRemove(category_id);
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
