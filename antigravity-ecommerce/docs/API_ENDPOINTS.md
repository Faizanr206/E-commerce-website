# API Endpoints Documentation

All requests should be made to `http://localhost:5000/api`.

## Authentication & Users
-   `POST /api/users/login`: Authenticate user and set HTTP-only cookie.
-   `POST /api/users`: Register a new user.
-   `POST /api/users/logout`: Clear JWT cookie.
-   `GET /api/users/profile`: Get current user info (Protected).

## Products
-   `GET /api/products`: Fetch all products.
-   `GET /api/products/:id`: Fetch single product by ID.
-   `POST /api/products`: Create new product (Admin Only).
-   `PUT /api/products/:id`: Update existing product (Admin Only).
-   `DELETE /api/products/:id`: Remove product (Admin Only).
-   `GET /api/products/admin/kpis`: Fetch dashboard metrics (Admin Only).
-   `POST /api/products/:id/reviews`: Submit product review (Verified Purchase Only).

## Checkout & Orders
-   `POST /api/checkout/create-session`: Create Stripe session (PKR).
-   `POST /api/orders/confirm`: Verify payment and save order to DB.
-   `GET /api/orders/mine`: Get user's order history (Protected).
