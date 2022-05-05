import * as _ from "lodash";
import {
	userCreate,
	userIndex,
	userPatch,
	userDeActivate,
	userShow
} from "../../models/user";
import { User } from "../../typings/interface";
import { UserQuery } from "../../typings/types";
import testData from "../helpers/testData";

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
			user_email: testData.dataBaseTestUser.user_email,
			user_firstname: testData.dataBaseTestUser.user_firstname,
			user_lastname: testData.dataBaseTestUser.user_lastname,
			user_password: testData.dataBaseTestUser.user_password
		} as unknown as Omit<User, "user_id">);
		testData.dataBaseTestUser.user_id = result.user_id as unknown as number;
		expect(result).toEqual(
			_.omit(testData.dataBaseTestUser, ["user_password"])
		);
	});

	it("index method should return a list of active Users", async () => {
		const result = await userIndex();
		expect(result).toEqual([
			_.omit(testData.dataBaseTestUser, ["user_password", "user_active"])
		]);
	});

	it("show method should patch user", async () => {
		const result = await userPatch({
			user_id: testData.dataBaseTestUser.user_id,
			user_password: "New password"
		} as unknown as UserQuery);
		expect(result).toEqual(
			_.omit(testData.dataBaseTestUser, ["user_password"])
		);
	});

	it("delete method should deactivate the user", async () => {
		await userDeActivate(testData.dataBaseTestUser.user_id);
		testData.dataBaseTestUser.user_active = false;
		const result = await userIndex();
		expect(result).toEqual([]);
	});

	it("show method should return the correct user with active = false", async () => {
		const result = await userShow(testData.dataBaseTestUser.user_id);
		expect(result.user_active).toBe(false);
	});
});
