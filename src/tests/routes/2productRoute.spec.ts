import supertest from "supertest";
import { productIndex, productShow } from "../../models/product";
import { app } from "../../server";
import { Product } from "../../typings/interface";

describe("Products Endpoint /api/product", () => {
	const req = supertest(app);
	const newProduct: Product = {
		product_id: -1,
		product_name: "laptop",
		product_description: "DELL",
		product_price: "6000",
		category_id: 2
	};

	it("POST should create new product POST /api/product", done => {
		req.post("/api/product")
			.set("Content-Type", "application/json")
			.send({
				product_name: newProduct.product_name,
				product_description: newProduct.product_description,
				product_price: newProduct.product_price,
				category_id: newProduct.category_id
			})

			.expect(201)
			.then(async response => {
				expect(response.body.data.product_id).toBeTruthy();
				newProduct.product_id = response.body.data.product_id;
				expect(response.body.data).toEqual({
					product_id: newProduct.product_id,
					product_name: newProduct.product_name,
					product_description: newProduct.product_description,
					product_price: parseInt(
						newProduct.product_price,
						10
					).toFixed(2),
					category_id: newProduct.category_id
				});
				done();
			});
	});

	it(" GET /api/product/:product_id should return correct product", done => {
		req.get(`/api/product/${newProduct.product_id}`)
			.expect(200)
			.then(async response => {
				expect(response.body.data).toBeTruthy();
				expect(response.body.data).toEqual(
					await productShow(`${newProduct.product_id}`)
				);
				done();
			});
	});

	it(" GET /api/product should return list of products", done => {
		req.get("/api/product")
			.expect(200)
			.then(async response => {
				expect(response.body.data).toEqual(jasmine.any(Array));
				expect(response.body.data.length).toBeTruthy();
				expect(response.body.data).toEqual(await productIndex());
				done();
			});
	});

	it(" Delete /api/product should delete the product", done => {
		req.delete(`/api/product/${newProduct.product_id}`)
			.expect(200)
			.then(async () => {
				expect((await productIndex()).length).toEqual(2);
				done();
			});
	});
});
