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
			email: "email@c.com",
			firstname: "Sh",
			lastname: "A",
			password: "password"
		} as unknown as UserQuery);
		expect(result).toEqual({
			id: 1,
			email: "email@c.com",
			firstname: "Sh",
			lastname: "A",
			password: "password",
			active: true
		});
	});

	it("index method should return a list of active Users", async () => {
		const result = await index();
		expect(result).toEqual([
			{
				id: 1,
				email: "email@c.com",
				firstname: "Sh",
				lastname: "A"
			}
		] as unknown as UserQuery[]);
	});

	it("show method should return the correct user", async () => {
		const result = await show("1");
		expect(result).toEqual({
			id: 1,
			email: "email@c.com",
			firstname: "Sh",
			lastname: "A",
			password: "password",
			active: true
		});
	});

	it("show method should patch user", async () => {
		const result = await patch({
			id: 1,
			password: "New password"
		} as unknown as UserQuery);
		expect(result).toEqual({
			id: 1,
			email: "email@c.com",
			firstname: "Sh",
			lastname: "A",
			password: "New password",
			active: true
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
			id: 1,
			email: "email@c.com",
			firstname: "Sh",
			lastname: "A",
			password: "New password",
			active: false
		});
	});
});
