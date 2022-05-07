import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../typings/interface";

export const loginService = (
	user: Omit<User, "user_password">
): undefined | string => {
	if (!user) return undefined;
	return jwt.sign(user, process.env.ACCESS_TOKEN || "token", {
		expiresIn: process.env.JWT_EXPIRATION || "24h"
	});
};

export const hashPasswordService = async (
	user_password: string
): Promise<string> => {
	const salt = await bcrypt.genSalt(
		parseInt(process.env.SALT_ROUNDS || "10", 10)
	);
	return bcrypt.hash(user_password, salt);
};
