# Backend API Documentation
==========================

## Table of Contents
-----------------

1. [User Registration Flow](#user-registration-flow)
   - [Email Verification](#user-email-verification)
   - [OTP Verification](#user-otp-verification)
   - [Complete Registration](#user-complete-registration)
2. [User Authentication Flow](#user-authentication-flow)
   - [Login](#user-login)
   - [Forgot Password](#user-forgot-password)
   - [Reset Password](#user-reset-password)
3. [User Profile Endpoint](#user-profile-endpoint)
4. [User Logout Endpoint](#user-logout-endpoint)
5. [Captain Registration Flow](#captain-registration-flow)
   - [Email Verification](#captain-email-verification)
   - [OTP Verification](#captain-otp-verification)
   - [Complete Registration](#captain-complete-registration)
6. [Captain Authentication Flow](#captain-authentication-flow)
   - [Login](#captain-login)
   - [Forgot Password](#captain-forgot-password)
   - [Reset Password](#captain-reset-password)
7. [Captain Profile Endpoint](#captain-profile-endpoint)
8. [Captain Logout Endpoint](#captain-logout-endpoint)
9. [Example Request and Response](#example-request-and-response)

## User Registration Flow
------------------------

### User Email Verification

#### Description
Initial step to verify email before registration.

#### Request
* **Method:** `POST`
* **URL:** `/users/signup`
* **Request Body:**
    + `email`: Email address to verify

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP sent successfully

### User OTP Verification

#### Description
Verify OTP sent to email.

#### Request
* **Method:** `POST`
* **URL:** `/users/signup/verify-otp`
* **Request Body:**
    + `email`: Verified email
    + `otp`: OTP received

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP verified successfully

### User Complete Registration

#### Description
Complete user registration after OTP verification.

#### Request
* **Method:** `POST`
* **URL:** `/users/signup/complete-registration`
* **Request Body:**
    + `fullname`: Object containing firstname and lastname
    + `email`: Verified email
    + `password`: Password (min 8 chars)

#### Response
* **Status Code:** `201 Created`
* **Response Body:**
    + `token`: JWT token
    + `user`: User details

## User Authentication Flow
--------------------------

### User Login

#### Description
Regular login endpoint.

#### Request
* **Method:** `POST`
* **URL:** `/users/login`
* **Request Body:**
    + `email`: Registered email
    + `password`: Account password

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `token`: JWT token
    + `user`: User details

### User Forgot Password

#### Description
Initiate password reset flow.

#### Request
* **Method:** `GET`
* **URL:** `/users/login/send-otp`
* **Query Params:**
    + `email`: Registered email

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP sent successfully

### User Reset Password

#### Description
Reset password with OTP verification.

#### Request
* **Method:** `POST`
* **URL:** `/users/login/set-password`
* **Request Body:**
    + `email`: Registered email
    + `otp`: Received OTP
    + `password`: New password

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: Password updated successfully

[...existing user endpoints...]

## Captain Registration Flow
---------------------------

### Captain Email Verification

#### Description
Initial step to verify email before registration.

#### Request
* **Method:** `POST`
* **URL:** `/captains/signup`
* **Request Body:**
    + `email`: Email address to verify

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP sent successfully

### Captain OTP Verification

#### Description
Verify OTP sent to email.

#### Request
* **Method:** `POST`
* **URL:** `/captains/signup/verify-otp`
* **Request Body:**
    + `email`: Verified email
    + `otp`: OTP received

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP verified successfully

### Captain Complete Registration

#### Description
Complete captain registration after OTP verification.

#### Request
* **Method:** `POST`
* **URL:** `/captains/signup/complete-registration`
* **Request Body:**
    + `fullname`: Object containing firstname and lastname
    + `email`: Verified email
    + `password`: Password (min 6 chars)
    + `vehicle`: Object containing model, plate, capacity, vehicleType

#### Response
* **Status Code:** `201 Created`
* **Response Body:**
    + `token`: JWT token
    + `captain`: Captain details

## Captain Authentication Flow
-----------------------------

### Captain Login

#### Description
Regular login endpoint.

#### Request
* **Method:** `POST`
* **URL:** `/captains/login`
* **Request Body:**
    + `email`: Registered email
    + `password`: Account password

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `token`: JWT token
    + `captain`: Captain details

### Captain Forgot Password

#### Description
Initiate password reset flow.

#### Request
* **Method:** `GET`
* **URL:** `/captains/login/send-otp`
* **Query Params:**
    + `email`: Registered email

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: OTP sent successfully

### Captain Reset Password

#### Description
Reset password with OTP verification.

#### Request
* **Method:** `POST`
* **URL:** `/captains/login/set-password`
* **Request Body:**
    + `email`: Registered email
    + `otp`: Received OTP
    + `password`: New password

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: Password updated successfully

[...existing captain endpoints...]

## Captain Profile Endpoint
-----------------------

### Description

The `/captains/profile` endpoint is used to retrieve the authenticated captain's profile data. It requires a valid JWT token in the `Authorization` header or as a cookie.

### Request
------------

* **Method:** `GET`
* **URL:** `/captains/profile`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
-------------

* **Status Code:** `200 OK` (on successful retrieval)
* **Response Body:**
    + `captain`: An object with the authenticated captain's data

## Captain Logout Endpoint
----------------------

### Description

The `/captains/logout` endpoint is used to log out the authenticated captain. It requires a valid JWT token in the `Authorization` header or as a cookie.<br>
It Logouts the current captain and blacklist the token provided in cookie or headers.

### Request
------------

* **Method:** `GET`
* **URL:** `/captains/logout`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
-------------

* **Status Code:** `200 OK` (on successful logout)
* **Response Body:**
    + `message`: A string indicating successful logout

## Example Request and Response
-------------------------------

### User Registration

#### Sample Model
```json
{
  "fullname": {
    "firstname": "ABCD",
    "lastname": "EFGH"
  },
  "email": "a@example.com",
  "password": "password123"
}
```
### Captain Registration

#### Sample Model
```json
{
  "fullname": {
    "firstname": "ABCD",
    "lastname": "EFGH"
  },
  "email": "a@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "vehicleType": "car"
  }
}