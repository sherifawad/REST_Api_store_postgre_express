import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void | Response => {
	try {
		let token = String(
			req.headers["x-access-token"] || req.headers.authorization || ""
		);
		if (token && token.startsWith("Bearer")) token = token.slice(7);
		if (token && token.startsWith("token")) token = token.slice(6);

		if (!token) {
			return res.status(401).send({
				auth: false,
				message: "authentication required to access"
			});
		}
		const decoded = jwt.verify(
			token,
			process.env.ACCESS_TOKEN || "my_access"
		);
		if (!decoded) {
			return res
				.status(403)
				.send({ auth: false, message: "there is no token" });
		}
		next();
	} catch (err) {
		return res.status(500).send({
			status: 500,
			auth: false,
			message: "Failed to authenticate token."
		});
	}
};

export default authenticationMiddleware;
