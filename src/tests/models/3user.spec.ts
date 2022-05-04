import {
	userCreate,
	userIndex,
	userPatch,
	userDeActivate,
	userShow
} from "../../models/user";
import { User } from "../../typings/interface";
import { UserQuery } from "../../typings/types";

describe("User Model", () => {
	it("should have an index method", () => {
		expect(userIndex).toBeDefined();
	});

	it("should have a show method", () => {
		expect(userShow).toBeDefined();
	});

	it("should have a create method", () => {
		expect(userCreate).toBeDefined();
	});

	it("should have a update method", () => {
		expect(userPatch).toBeDefined();
	});

	it("should have a deActivate method", () => {
		expect(userDeActivate).toBeDefined();
	});

	it("create method should add a user", async () => {
		const result = await userCreate({
			user_email: "email@c.com",
			user_firstname: "Sh",
			user_lastname: "A",
			user_password: "password"
		} as unknown as UserQuery);
		expect(result).toEqual({
			user_id: 1,
			user_email: "email@c.com",
			user_firstname: "Sh",
			user_lastname: "A",
			user_password: "password",
			user_active: true
		});
	});

	it("index method should return a list of active Users", async () => {
		const result = await userIndex();
		expect(result).toEqual([
			{
				user_id: 1,
				user_email: "email@c.com",
				user_firstname: "Sh",
				user_lastname: "A"
			}
		] as unknown as Omit<User, "user_password">[]);
	});

	it("show method should return the correct user", async () => {
		const result = await userShow("1");
		expect(result).toEqual({
			user_id: 1,
			user_email: "email@c.com",
			user_firstname: "Sh",
			user_lastname: "A",
			user_password: "password",
			user_active: true
		});
	});

	it("show method should patch user", async () => {
		const result = await userPatch({
			user_id: 1,
			user_password: "New password"
		} as unknown as UserQuery);
		expect(result).toEqual({
			user_id: 1,
			user_email: "email@c.com",
			user_firstname: "Sh",
			user_lastname: "A",
			user_password: "New password",
			user_active: true
		});
	});

	it("delete method should deactivate the user", async () => {
		await userDeActivate("1");
		const result = await userIndex();
		expect(result).toEqual([]);
	});

	it("show method should return the correct user with active = false", async () => {
		const result = await userShow("1");
		expect(result).toEqual({
			user_id: 1,
			user_email: "email@c.com",
			user_firstname: "Sh",
			user_lastname: "A",
			user_password: "New password",
			user_active: false
		});
	});
});
