# Chappi API Documentation

This document provides a detailed description of the Chappi API endpoints.

## Table of Contents

*   [Authentication](#authentication)
*   [Products](#products)
*   [Inventory](#inventory)
*   [Purchases](#purchases)
*   [Missions](#missions)
*   [Users](#users)
*   [Redemptions](#redemptions)
*   [Brands](#brands)
*   [Admin](#admin)
*   [Retailers](#retailers)

---

## Authentication

### `POST /api/auth/register`

Registers a new user.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The user's email address. |
| `password` | `string` | The user's password. |
| `role` | `string` | The user's role (`customer`, `brand`, or `retailer`). |
| `name` | `string` | The user's name. |
| `first_name` | `string` | The user's first name. |
| `last_name` | `string` | The user's last name. |
| `country` | `string` | The user's country. |
| `state` | `string` | The user's state. |
| `city` | `string` | The user's city. |
| `address` | `string` | The user's address. |
| `phone_number` | `string` | The user's phone number. |


**Example Response:**

```json
{
  "message": "User registered successfully."
}
```

### `POST /api/auth/login`

Logs in a user.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The user's email address. |
| `password` | `string` | The user's password. |

**Example Response:**

```json
{
  "token": "your-jwt-token"
}
```

### `POST /api/auth/preregister-retailer`

Pre-registers a new retailer (for admin use).

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The retailer's email address. |
| `name` | `string` | The retailer's name. |

**Example Response:**

```json
{
  "message": "Retailer pre-registered successfully."
}
```

---

## Products

### `GET /api/products`

Gets all products.

**Example Response:**

```json
[
  {
    "id": 1,
    "brand_id": 1,
    "name": "Product 1",
    "image_url": "https://storage.googleapis.com/your-bucket/product1.jpg",
    "description": "This is product 1.",
    "created_at": "2025-07-19T12:00:00.000Z"
  }
]
```

### `POST /api/products`

Creates a new product.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The product's name. |
| `image` | `file` | The product's image. |

**Example Response:**

```json
{
  "id": 1,
  "brand_id": 1,
  "name": "Product 1",
  "image_url": "https://storage.googleapis.com/your-bucket/product1.jpg",
  "description": "This is product 1.",
  "created_at": "2025-07-19T12:00:00.000Z"
}
```

---

## Inventory

### `GET /api/inventory`

Gets the inventory for a retailer.

**Example Response:**

```json
[
  {
    "quantity": 10,
    "price_per_unit": 10.00,
    "product_name": "Product 1"
  }
]
```

### `POST /api/inventory`

Adds to the inventory.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `productId` | `number` | The product's ID. |
| `quantity` | `number` | The quantity to add. |
| `price` | `number` | The price per unit. |

**Example Response:**

```json
{
  "id": 1,
  "retailer_id": 1,
  "product_id": 1,
  "quantity": 10,
  "price_per_unit": 10.00
}
```

---

## Purchases

### `POST /api/purchases/suggest-product`

Suggests products from an image.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `retailerCode` | `string` | The retailer's unique code. |
| `image` | `file` | The image of the product. |

**Example Response:**

```json
{
  "suggestedProducts": [
    {
      "id": 1,
      "name": "Product 1",
      "description": "This is product 1.",
      "price_per_unit": 10.00,
      "image_url": "https://storage.googleapis.com/your-bucket/product1.jpg"
    }
  ],
  "imageUrl": "https://storage.googleapis.com/your-bucket/purchase1.jpg"
}
```

### `POST /api/purchases`

Submits a new purchase.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `retailerCode` | `string` | The retailer's unique code. |
| `productId` | `number` | The product's ID. |
| `quantity` | `number` | The quantity purchased. |
| `imageUrl` | `string` | The URL of the purchase image. |

**Example Response:**

```json
{
  "id": 1,
  "customer_id": 1,
  "retailer_id": 1,
  "product_id": 1,
  "quantity": 1,
  "total_amount": 10.00,
  "image_url": "https://storage.googleapis.com/your-bucket/purchase1.jpg",
  "status": "pending",
  "created_at": "2025-07-19T12:00:00.000Z",
  "product_name": "Product 1"
}
```

### `GET /api/purchases/pending`

Gets pending purchases for a retailer.

**Example Response:**

```json
[
  {
    "id": 1,
    "quantity": 1,
    "total_amount": 10.00,
    "image_url": "https://storage.googleapis.com/your-bucket/purchase1.jpg",
    "created_at": "2025-07-19T12:00:00.000Z",
    "customer_email": "customer@example.com",
    "product_name": "Product 1"
  }
]
```

### `GET /api/purchases/customer`

Gets all purchases for a customer.

**Example Response:**

```json
[
  {
    "id": 1,
    "quantity": 1,
    "total_amount": 10.00,
    "image_url": "https://storage.googleapis.com/your-bucket/purchase1.jpg",
    "created_at": "2025-07-19T12:00:00.000Z",
    "status": "pending",
    "product_name": "Product 1",
    "retailer_name": "Retailer 1"
  }
]
```

### `PUT /api/purchases/:id/status`

Confirms or rejects a purchase.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | `string` | The new status (`confirmed` or `rejected`). |

**Example Response:**

```json
{
  "message": "Purchase confirmed successfully."
}
```

---

## Missions

### `GET /api/missions`

Gets all missions.

**Example Response:**

```json
[
  {
    "id": 1,
    "brand_id": 1,
    "name": "Mission 1",
    "description": "This is mission 1.",
    "points": 100,
    "start_date": "2025-07-19T12:00:00.000Z",
    "end_date": "2025-08-19T12:00:00.000Z",
    "created_at": "2025-07-19T12:00:00.000Z"
  }
]
```

### `GET /api/missions/active`

Gets active missions for customers.

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Mission 1",
    "description": "This is mission 1.",
    "points": 100,
    "start_date": "2025-07-19T12:00:00.000Z",
    "end_date": "2025-08-19T12:00:00.000Z",
    "product_name": "Product 1",
    "image_url": "https://storage.googleapis.com/your-bucket/product1.jpg"
  }
]
```

### `POST /api/missions`

Creates a new mission and initiates a Paystack payment.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The mission's name. |
| `description` | `string` | The mission's description. |
| `points` | `number` | The points awarded for the mission. |
| `startDate` | `string` | The mission's start date. |
| `endDate` | `string` | The mission's end date. |
| `productIds` | `number[]` | The IDs of the products in the mission. |
| `budget` | `number` | The budget for the mission (amount to be paid via Paystack). |

**Example Response:**

```json
{
  "message": "Mission created successfully.",
  "authorization_url": "https://paystack.com/pay/xxxxxxxxxx" 
}
```

### `GET /api/missions/verify-payment`

Verifies a Paystack payment for a mission.

**Query Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `reference` | `string` | The Paystack transaction reference. |

**Example Response (Success):**

```json
{
  "message": "Payment verified successfully."
}
```

**Example Response (Failure):**

```json
{
  "error": "Payment verification failed."
}
```

---

## Users

### `GET /api/users/points`

Gets customer points.

**Example Response:**

```json
{
  "points": 100
}
```

---

## Redemptions

### `GET /api/redemptions`

Gets all redemption items.

**Example Response:**

```json
[
  {
    "id": 1,
    "brand_id": 1,
    "name": "Redemption Item 1",
    "description": "This is redemption item 1.",
    "points_cost": 100,
    "image_url": "https://storage.googleapis.com/your-bucket/redemption1.jpg",
    "created_at": "2025-07-19T12:00:00.000Z"
  }
]
```

### `POST /api/redemptions`

Creates a new redemption item.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The redemption item's name. |
| `description` | `string` | The redemption item's description. |
| `pointsCost` | `number` | The points cost of the redemption item. |
| `imageUrl` | `string` | The URL of the redemption item's image. |

**Example Response:**

```json
{
  "id": 1,
  "brand_id": 1,
  "name": "Redemption Item 1",
  "description": "This is redemption item 1.",
  "points_cost": 100,
  "image_url": "https://storage.googleapis.com/your-bucket/redemption1.jpg",
  "created_at": "2025-07-19T12:00:00.000Z"
}
```

### `POST /api/redemptions/redeem`

Redeems an item.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `redemptionItemId` | `number` | The ID of the redemption item. |
| `pointsCost` | `number` | The points cost of the redemption item. |

**Example Response:**

```json
{
  "message": "Item redeemed successfully.",
  "redemption": {
    "id": 1,
    "customer_id": 1,
    "redemption_item_id": 1,
    "points_deducted": 100,
    "redeemed_at": "2025-07-19T12:00:00.000Z"
  }
}
```

---

## Brands

### `GET /api/brands/analytics`

Gets brand analytics.

**Example Response:**

```json
{
  "totalPurchases": {
    "total_purchases": 10,
    "total_revenue": 100.00
  },
  "missionPerformance": [
    {
      "mission_name": "Mission 1",
      "unique_customers": 5,
      "total_products_purchased": 10,
      "total_revenue_from_mission": 100.00
    }
  ],
  "redemptionRates": [
    {
      "redemption_item_name": "Redemption Item 1",
      "total_redemptions": 5
    }
  ]
}
```

---

## Admin

### `GET /api/admin/retailers`

Gets all retailers for the admin dashboard.

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Retailer 1",
    "unique_code": "abcdefgh",
    "is_onboarded": true
  }
]
```

### `GET /api/admin/generate-qr/:retailerId`

Generates a QR code for a single retailer.

**Example Response:**

```json
{
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```

### `POST /api/admin/generate-qr-pdf`

Generates a QR codes PDF for multiple new retailers.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `numRetailers` | `number` | The number of retailers to generate QR codes for. |

**Example Response:**

A PDF file containing the QR codes.

### `GET /api/admin/generate-unassigned-qr-pdf`

Generates a QR codes PDF for all unassigned retailers.

**Example Response:**

A PDF file containing the QR codes.

---

## Retailers

### `POST /api/retailers/onboard`

Onboards a new retailer.

**Request Body:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `uniqueCode` | `string` | The retailer's unique code. |
| `password` | `string` | The retailer's password. |
| `name` | `string` | The retailer's name. |
| `email` | `string` | The retailer's email address. |
| `first_name` | `string` | The retailer's first name. |
| `last_name` | `string` | The retailer's last name. |
| `country` | `string` | The retailer's country. |
| `state` | `string` | The retailer's state. |
| `city` | `string` | The retailer's city. |
| `address` | `string` | The retailer's address. |

**Example Response:**

```json
{
  "message": "Retailer onboarded successfully."
}
```

### `GET /api/retailers/profile`

Gets the retailer profile and QR code.

**Example Response:**

```json
{
  "id": 1,
  "name": "Retailer 1",
  "unique_code": "abcdefgh",
  "qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=abcdefgh",
  "email": "retailer@example.com",
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```