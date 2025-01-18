# Backend API Documentation
==========================

## Table of Contents
-----------------

1. [User   Registration Endpoint](#user-registration-endpoint)
2. [User   Login Endpoint](#user-login-endpoint)
3. [User   Profile Endpoint](#user-profile-endpoint)
4. [User   Logout Endpoint](#user-logout-endpoint)
5. [Example Request and Response](#example-request-and-response)

## User Registration Endpoint
---------------------------

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

## User Login Endpoint
----------------------

### Description

The `/users/login` endpoint is used to authenticate an existing user. It accepts a JSON payload with the user's email and password and returns a JSON response with a JWT token and the user's data.

### Request
------------

* **Method:** `POST`
* **URL:** `/users/login`
* **Content-Type:** `application/json`
* **Request Body:**
	+ `email`: A string representing the user's email address
	+ `password`: A string representing the user's password (minimum 8 characters)

### Response
-------------

* **Status Code:** `200 OK` (on successful login)
* **Response Body:**
	+ `token`: A JWT token for the authenticated user
	+ `user`: An object with the authenticated user's data

## User Profile Endpoint
-----------------------

### Description

The `/users/profile` endpoint is used to retrieve the authenticated user's profile data. It requires a valid JWT token in the `Authorization` header or as a cookie.

### Request
------------

* **Method:** `GET`
* **URL:** `/users/profile`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
-------------

* **Status Code:** `200 OK` (on successful retrieval)
* **Response Body:**
	+ `user`: An object with the authenticated user's data

## User Logout Endpoint
----------------------

### Description

The `/users/logout` endpoint is used to log out the authenticated user. It requires a valid JWT token in the `Authorization` header or as a cookie.<br>
It Logouts the current user and blacklist the token provided in cookie or headers.

### Request
------------

* **Method:** `GET`
* **URL:** `/users/logout`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
-------------

* **Status Code:** `200 OK` (on successful logout)
* **Response Body:**
	+ `message`: A string indicating successful logout

## Example Request and Response
-------------------------------

### User Registration

#### Request
```json
POST /users/register HTTP/1.1
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "password123"
}