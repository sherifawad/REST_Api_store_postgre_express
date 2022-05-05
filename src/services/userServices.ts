import jwt from "jsonwebtoken";
import { userShow } from "../models/user";

export const loginService = (user_id: string | number): undefined | string => {
	const user = userShow(user_id);
	if (!user) return undefined;
	return jwt.sign(user, process.env.ACCESS_TOKEN || "token");
};
