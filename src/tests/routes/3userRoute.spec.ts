import supertest from "supertest";
import { userIndex, userShow } from "../../models/user";
import { app } from "../../server";
import { User } from "../../typings/interface";

describe("Users Endpoint /api/user", () => {
	const req = supertest(app);
	const newUser: User = {
		user_id: -1,
		user_email: "apiTeastemail@c.com",
		user_firstname: "ShapiTeast",
		user_lastname: "AapiTeast",
		user_password: "passwordapiTeast",
		user_active: true
	};

	it("POST should create new user POST /api/user", done => {
		req.post("/api/user")
			.send({
				user_email: newUser.user_email,
				user_firstname: newUser.user_firstname,
				user_lastname: newUser.user_lastname,
				user_password: newUser.user_password
			})

			.expect(201)
			.then(async response => {
				expect(response.body.data.user_id).toBeTruthy();
				newUser.user_id = response.body.data.user_id;
				expect(response.body.data).toEqual(
					await userShow(`${newUser.user_id}`)
				);
				done();
			});
	});

	it(" GET /api/user/:user_id should return correct user", done => {
		req.get(`/api/user/${newUser.user_id}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await userShow(`${newUser.user_id}`)
				);
				done();
			});
	});

	it(" GET /api/user should return list of users", done => {
		req.get("/api/user")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await userIndex());
				done();
			});
	});

	it(" Delete /api/user should deactivate the user", done => {
		req.delete(`/api/user/${newUser.user_id}`)
			.expect(200)
			.then(async () => {
				expect(await userIndex()).toEqual([]);
				done();
			});
	});
});
