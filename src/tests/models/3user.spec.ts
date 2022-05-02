import { create, index, patch, deActivate, show } from "../../models/user";
import { UserQuery } from "../../typings/types";

describe("User Model", () => {
	it("should have an index method", () => {
		expect(index).toBeDefined();
	});

	it("should have a show method", () => {
		expect(show).toBeDefined();
	});

	it("should have a create method", () => {
		expect(create).toBeDefined();
	});

	it("should have a update method", () => {
		expect(patch).toBeDefined();
	});

	it("should have a deActivate method", () => {
		expect(deActivate).toBeDefined();
	});

	it("create method should add a user", async () => {
		const result = await create({
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
		const result = await index();
		expect(result).toEqual([
			{
				user_id: 1,
				user_email: "email@c.com",
				user_firstname: "Sh",
				user_lastname: "A"
			}
		] as unknown as UserQuery[]);
	});

	it("show method should return the correct user", async () => {
		const result = await show("1");
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
		const result = await patch({
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
		await deActivate("1");
		const result = await index();
		expect(result).toEqual([]);
	});

	it("show method should return the correct user with active = false", async () => {
		const result = await show("1");
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
