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
9. [Maps Services](#maps-services)
   - [Get Coordinates](#get-coordinates)
   - [Get Distance & Time](#get-distance-and-time)
   - [Get Address Suggestions](#get-address-suggestions)
10. [Ride Management](#ride-management)
    - [Create Ride](#create-ride)
    - [Get Fare](#get-fare)
    - [Confirm Ride](#confirm-ride)
    - [Start Ride](#start-ride)
    - [End Ride](#end-ride)
11. [Example Request and Response](#example-request-and-response)

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

## Captain Profile Endpoint
-----------------------

### Description
The `/captains/profile` endpoint is used to retrieve the authenticated captain's profile data. It requires a valid JWT token in the `Authorization` header or as a cookie.

### Request
* **Method:** `GET`
* **URL:** `/captains/profile`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `captain`: An object with the authenticated captain's data

## Captain Logout Endpoint
----------------------

### Description
The `/captains/logout` endpoint is used to log out the authenticated captain. It requires a valid JWT token in the `Authorization` header or as a cookie.

### Request
* **Method:** `GET`
* **URL:** `/captains/logout`
* **Authorization:** `Bearer <JWT Token>` or `Cookie: token=<JWT Token>`

### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: A string indicating successful logout

## Maps Services
---------------

### Get Coordinates

#### Description
Convert address to coordinates.

#### Request
* **Method:** `GET`
* **URL:** `/maps/get-coordinates`
* **Authorization:** `Bearer <JWT Token>`
* **Query Params:**
    + `address`: Address to convert

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + Array containing `[latitude, longitude]`

### Get Distance and Time

#### Description
Get distance and time between two points.

#### Request
* **Method:** `POST`
* **URL:** `/maps/get-distance`
* **Authorization:** `Bearer <JWT Token>`
* **Request Body:**
    + `start`: Array of start coordinates `[lat, lng]`
    + `end`: Array of end coordinates `[lat, lng]`

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `distance`: Distance in meters 
    + `duration`: Duration in seconds

### Get Address Suggestions 

#### Description
Get address autocomplete suggestions.

#### Request
* **Method:** `GET`
* **URL:** `/maps/get-suggestions`
* **Authorization:** `Bearer <JWT Token>`
* **Query Params:**
    + `input`: Partial address text

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + Array of address suggestions

## Ride Management
----------------

### Create Ride

#### Description
Create a new ride request.

#### Request
* **Method:** `POST`
* **URL:** `/rides/create`
* **Authorization:** `Bearer <JWT Token>`
* **Request Body:**
    + `pickup`: Pickup location coordinates
    + `destination`: Destination coordinates
    + `vehicleType`: Type of vehicle ('car', 'motorbike', 'auto')

#### Response
* **Status Code:** `201 Created`
* **Response Body:**
    + `ride`: Created ride details

### Get Fare

#### Description
Get fare estimate for a ride.

#### Request
* **Method:** `GET` 
* **URL:** `/rides/get-fare`
* **Authorization:** `Bearer <JWT Token>`
* **Query Params:**
    + `pickup`: Pickup location address
    + `destination`: Destination address

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `auto`: Fare estimate for auto
    + `car`: Fare estimate for car
    + `motorbike`: Fare estimate for motorbike

### Confirm Ride

#### Description
Confirm a ride for the captain.

#### Request
* **Method:** `POST`
* **URL:** `/rides/confirm`
* **Authorization:** `Bearer <JWT Token>`
* **Request Body:**
    + `rideId`: ID of the ride to confirm

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: Ride confirmed successfully

### Start Ride

#### Description
Start a ride using the ride ID and OTP.

#### Request
* **Method:** `GET`
* **URL:** `/rides/start-ride`
* **Authorization:** `Bearer <JWT Token>`
* **Query Params:**
    + `rideId`: ID of the ride to start
    + `otp`: OTP for verification

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: Ride started successfully

### End Ride

#### Description
End a ride using the ride ID.

#### Request
* **Method:** `POST`
* **URL:** `/rides/end-ride`
* **Authorization:** `Bearer <JWT Token>`
* **Request Body:**
    + `rideId`: ID of the ride to end

#### Response
* **Status Code:** `200 OK`
* **Response Body:**
    + `message`: Ride ended successfully

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
