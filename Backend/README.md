# Backend API Documentation
==========================

## Table of Contents
-----------------

1. [User  Registration Endpoint](#user-registration-endpoint)
2. [Request](#request)
3. [Response](#response)
4. [Example Request](#example-request)

## User Registration Endpoint
-----------------------------

### Description

The `/users/register` endpoint is used to create a new user account. It accepts a JSON payload with the user's details and returns a JSON response with the newly created user's data and a JWT token.

### Request
------------

* **Method:** `POST`
* **URL:** `/users/register`
* **Content-Type:** `application/json`
* **Request Body:**
	+ `fullname`: An object with `firstname` and `lastname` properties (both strings)
	+ `email`: A string representing the user's email address
	+ `password`: A string representing the user's password (minimum 8 characters)

### Response
-------------

* **Status Code:** `201 Created` (on successful registration)
* **Response Body:**
	+ `token`: A JWT token for the newly created user
	+ `user`: An object with the newly created user's data

### Example Request
-----------------

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "password123"
}