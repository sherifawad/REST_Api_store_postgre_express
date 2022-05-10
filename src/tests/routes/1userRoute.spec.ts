import * as _ from "lodash";
import supertest from "supertest";
import { userIndex, userShow } from "../../models/user";
import { app } from "../../server";
import client from "../../services/connection";
import testData from "../helpers/testData";

describe("Users Endpoint /api/user", () => {
	afterAll(() => {
		console.log(
			`function: User Router afterAll, total: ${client.totalCount}, idle: ${client.idleCount}, waiting: ${client.waitingCount}`
		);
		console.log("=========================================");
	});
	const req = supertest(app);

	it("POST should create new user POST /api/user", done => {
		req.post("/api/user")
			.send({
				user_email: testData.apiTestUser.user_email,
				user_firstname: testData.apiTestUser.user_firstname,
				user_lastname: testData.apiTestUser.user_lastname,
				user_password: testData.apiTestUser.user_password
			})
			.expect(201)
			.then(async response => {
				testData.apiTestUser.user_id = response.body.data.user_id;
				testData.apiTestUserToken = response.body.token;
				expect(response.body.data.user_id).toBeTruthy();
				const user = await userShow(`${testData.apiTestUser.user_id}`);
				expect(response.body.data).toEqual(
					_.omit(user, ["user_password"])
				);
				done();
			});
	});

	it(" GET /api/user/:user_id should return correct user", done => {
		req.get(`/api/user/${testData.apiTestUser.user_id}`)
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await userShow(`${testData.apiTestUser.user_id}`)
				);
				done();
			});
	});

	it(" GET /api/user should return list of users", done => {
		req.get("/api/user")
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await userIndex());
				done();
			});
	});

	it(" Delete /api/user should deactivate the user", done => {
		req.delete(`/api/user/${testData.apiTestUser.user_id}`)
			.set("X-ACCESS-TOKEN", testData.apiTestUserToken)
			.expect(200)
			.then(async () => {
				expect(await userIndex()).toEqual([]);
				done();
			});
	});
});
