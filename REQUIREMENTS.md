# API Requirements

The company stakeholders want to create an online storefront to showcase their
great product ideas. Users need to be able to browse an index of all products,
see the specifics of a single product, and add products to an order that they
can view in a cart page. You have been tasked with building the API that will
support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe
what endpoints the API needs to supply, as well as data shapes the frontend and
backend have agreed meet the requirements of the application.

## API Endpoints

#### Users

-   Index [token required] - An INDEX route: '/user' [GET]
-   Show [token required] - A SHOW route: '/user/:id' [GET]
-   Create route: '/user' [POST]

#### categories

-   An INDEX route [token required] : '/category' [GET]
-   A SHOW route [token required] : '/category/:category_id' [GET]
-   A Create [token required] - A CREATE route: '/category' [POST]
-   A Delete route [token required] : '/category/:category_id' [DELETE]

#### Products

-   An INDEX route [token required] : '/product' [GET]
-   A SHOW route [token required] : '/product/:product_id' [GET]
-   A Create [token required] - A CREATE route: '/product' [POST]
-   A Delete route [token required] : '/product/:product_id' [DELETE]

#### Orders

-   An INDEX route [token required] : '/order' [GET]
-   A SHOW route [token required] : '/order/:order_id' [GET]
-   A Create [token required] - A CREATE route: '/order' [POST]
-   A Delete route [token required] : '/product/:order_id' [DELETE]

## Data Shapes

#### Users

-   user_id
-   user_email [UNIQUE]
-   user_firstName
-   user_lastName
-   user_password

#### Categories

-   category_id
-   category_name
-   category_description [OPTIONAL]
-   category_lastName
-   category_password

#### Products

-   product_id
-   product_name
-   category_description [OPTIONAL]
-   product_price 
-   category_id [OPTIONAL]

#### Orders

-   order_id
-   order_date
-   user_id

#### Orders_Products

-   order_id
-   orders_products_quantity
-   product_id
