# Payment Web Application API Documentation

This documentation provides details on the API endpoints for the Payment Web Application, including Deposit, Withdraw, and History functionalities. All endpoints require authentication using a Bearer token containing the Base64-encoded username.

## Authentication

All API endpoints require the `Authorization` header with a Bearer token containing the Base64-encoded username.

### Example

If your username is `john_doe`, you need to encode it to Base64. The Base64-encoded string for `john_doe` is `am9obl9kb2U=`. 

Add the following header to your requests:
Authorization: Bearer am9obl9kb2U=

## Endpoints

### 1. Deposit

Deposits a specified amount to the customer's account.

#### Request

- URL: `/api/v1/deposit`
- Method: `POST`
- Headers:
  Authorization: Bearer <Base64-encoded-username>
  Content-Type: application/json
- Body:
  {
    "amount": 100.50,
    "orderId": "ORDER12345",
    "timestamp": "2023-05-18T12:34:56Z"
  }

#### Response

- Success:
  - Status: `201 Created`
  - Body:
    {
      "customer_id": "UUID",
      "type": "deposit",
      "amount": 100.50,
      "order_id": "ORDER12345",
      "created_at": "2024-05-18 02:03:36",
      "updated_at": "2024-05-18 02:03:37"
    }
- Failure:
  - Status: `400 Bad Request` / `500 Internal Server Error`
  - Body:
    {
      "message": "Error message"
    }

### 2. Withdraw

Withdraws a specified amount from the customer's account.

#### Request

- URL: `/api/v1/withdraw`
- Method: `POST`
- Headers:
  Authorization: Bearer <Base64-encoded-username>
  Content-Type: application/json
- Body:
  {
    "amount": 50.25,
    "orderId": "ORDER54321",
    "timestamp": "2023-05-18T13:45:67Z"
  }

#### Response

- Success:
  - Status: `201 Created`
  - Body:
    {
      "customer_id": "UUID",
      "type": "withdrawal",
      "amount": 50.25,
      "order_id": "ORDER54321",
      "created_at": "2024-05-18 02:03:36",
      "updated_at": "2024-05-18 02:03:37"
    }
- Failure:
  - Status: `400 Bad Request` / `500 Internal Server Error`
  - Body:
    {
      "message": "Error message"
    }

### 3. History

Retrieves all transactions for the authenticated customer.

#### Request

- URL: `/api/v1/history`
- Method: `GET`
- Headers:
  Authorization: Bearer <Base64-encoded-username>

#### Response

- Success:
  - Status: `200 OK`
  - Body:
    [
      {
        "transaction_id": "UUID",
        "customer_id": "UUID",
        "type": "deposit",
        "amount": 100.50,
        "order_id": "ORDER12345",
        "created_at": "2024-05-18 02:03:36",
        "updated_at": "2024-05-18 02:03:37"
      },
      {
        "transaction_id": "UUID",
        "customer_id": "UUID",
        "type": "withdrawal",
        "amount": 50.25,
        "order_id": "ORDER54321",
        "created_at": "2024-05-18 02:03:36",
        "updated_at": "2024-05-18 02:03:37"
      }
    ]
- Failure:
  - Status: `400 Bad Request` / `500 Internal Server Error`
  - Body:
    {
      "message": "Error message"
    }

## Error Codes

- `401 Unauthorized`: Missing or invalid Bearer token.
- `404 Not Found`: Customer or resource not found.
- `400 Bad Request`: Invalid request parameters.
- `500 Internal Server Error`: An error occurred on the server.

## Notes

- Ensure that your Bearer token is correctly formatted and Base64-encoded.
- The timestamps should be in ISO 8601 format.
- The `amount` should be a float with two decimal places.
