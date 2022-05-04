/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express";
import {
	userCreate,
	userIndex,
	userPatch,
	userDeActivate,
	userShow
} from "../models/user";
import { User } from "../typings/interface";

export const userViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_id } = req.params;
		if (!user_id) throw new Error("No user_id");
		const data: User = await userShow(user_id);
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

export const usersViewController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const data: Omit<User, "user_password">[] = await userIndex();
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

export const userAddController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_firstname, user_lastname, user_email, user_password } =
			req.body;
		const data: User = await userCreate({
			user_firstname,
			user_lastname,
			user_email,
			user_password
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

export const userUpdateController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_firstname, user_lastname, user_email, user_password } =
			req.body;
		const { user_id } = req.params;
		if (!user_id) throw new Error("No user_id");
		const data = await userPatch({
			user_id: parseInt(user_id, 10),
			user_firstname,
			user_lastname,
			user_email,
			user_password
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

export const userDeleteController = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user_id } = req.params;
		if (!user_id) throw new Error("No user_id");
		await userDeActivate(user_id);
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
