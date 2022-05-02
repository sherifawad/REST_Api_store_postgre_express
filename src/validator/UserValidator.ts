import { body, param } from "express-validator";
import { checkEmailExists } from "../models/user";

// route image validator
export const UserValidator = {
	// validate get with query parameters
	checkUserCreate: [
		body("user_email")
			.isEmail()
			.custom(checkEmailExists)
			.withMessage("Email is not valid"),

		body("user_firstname")
			// if only white space throw error
			.notEmpty({ ignore_whitespace: true })
			.withMessage("firstname is empty or white space"),

		body("user_lastname")
			// if only white space throw error
			.notEmpty({ ignore_whitespace: true })
			.withMessage("lastname is empty or white space"),

		body("user_password")
			.trim()
			// if only white space throw error
			.isLength({ min: 8 })
			.withMessage("password is not valid")
	],
	checkUserEdit: [
		param("user_id")
			.not()
			.isEmpty({ ignore_whitespace: true })
			.trim()
			.escape()
			.withMessage("there is no user_id"),

		body("oldPassword")
			// OR
			.if(body("newPassword").exists())
			// ...then the old password must be too...
			.notEmpty()
			// ...and they must not be equal.
			.custom((value, { req }) => {
				if (req.body.newPassword) {
					if (value !== req.body.newPassword) {
						throw new Error("Passwords don't match");
					}
				}
				return value;
			}),

		body("user_email")
			.optional()
			.notEmpty({ ignore_whitespace: true })
			.withMessage("Invalid user email"),
		body("user_firstname")
			.optional()
			.notEmpty()
			.withMessage("Invalid user firstname"),
		body("user_lastname")
			.optional()
			.notEmpty()
			.withMessage("Invalid user lastname")
	]
};
