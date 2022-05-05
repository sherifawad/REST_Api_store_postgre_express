const testData = {
	dataBaseTestUser: {
		user_id: -1,
		user_email: "dataBaseTestUser@c.com",
		user_firstname: "dataBase",
		user_lastname: "TestUser",
		user_password: "password",
		user_active: true
	},
	apiTestUser: {
		user_id: -1,
		user_email: "apiTestUser@c.com",
		user_firstname: "pi",
		user_lastname: "TestUser",
		user_password: "password",
		user_active: true
	},
	apiTestUserToken: "",

	dataBaseTestCategory: {
		category_id: -1,
		category_name: "Electronics",
		category_description: "electronic category description"
	},
	apiTestCategory: {
		category_id: -1,
		category_name: "Computers&Laps",
		category_description: "Computers&Laps category description"
	},

	dataBaseTestProduct: {
		product_id: -1,
		product_name: "Nokia 3310",
		product_description: "a mobile made from strong materials",
		product_price: "3310.00",
		category_id: 1
	},
	apiTestProduct: {
		product_id: -1,
		product_name: "laptop",
		product_description: "DELL",
		product_price: "6000.00",
		category_id: 2
	},
	dataBaseTestOrder: {
		order_id: -1,
		user_id: 1,
		order_date: new Date().toISOString(),
		order_products: [
			{
				order_product_id: -1,
				order_id: -1,
				user_id: 1,
				order_product_quantity: 5,
				product_id: 1
			}
		]
	},
	apiTestOrder: {
		order_id: -1,
		user_id: 2,
		order_date: new Date().toISOString(),
		order_products: [
			{
				order_product_id: -1,
				order_id: -1,
				user_id: 2,
				order_product_quantity: 10,
				product_id: 2
			}
		]
	}
};

export default testData;
