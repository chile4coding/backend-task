# Authentication API Endpoints

This API provides separate endpoints for user authentication operations.

## Endpoints

### 1. Signup - `POST /api/auth/signup`

Creates a new user account with email, password, and role.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Valid Roles

- `user` - Regular user
- `admin` - Administrator
- `moderator` - Moderator

#### Response

**Success (201 Created)**

```json
{
  "message": "User created successfully",
  "user": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "role": "user",
    "emailVerified": false
  }
}
```

**Error Responses**

- `400` - Missing fields, invalid email, weak password, invalid role
- `409` - User with email already exists
- `500` - Server error

---

### 2. Login - `POST /api/auth/login`

Authenticates a user and returns their information.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

**Success (200 OK)**

```json
{
  "message": "User found",
  "user": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "role": "user",
    "emailVerified": false
  }
}
```

**Error Responses**

- `400` - Missing fields, invalid email format
- `404` - User not found
- `500` - Server error

---

### 3. Logout - `POST /api/auth/logout`

Handles user logout and clears server-side session data.

#### Request Body

None required.

#### Response

**Success (200 OK)**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**

- `500` - Server error

---

## Example Usage

### Signup

```javascript
const signupResponse = await fetch("/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "newuser@example.com",
    password: "securepassword123",
    role: "user",
  }),
});

const signupData = await signupResponse.json();
```

### Login

```javascript
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const loginData = await loginResponse.json();
```

### Logout

```javascript
const logoutResponse = await fetch("/api/auth/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});

const logoutData = await logoutResponse.json();
```

## Using curl

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

## Notes

- The login endpoint currently only verifies that the user exists. For full authentication, you'll need to implement password verification or use Firebase client-side authentication.
- The logout endpoint clears server-side session data and sends headers to clear client-side storage.
- All endpoints include comprehensive error handling for Firebase-specific errors.
- The signup endpoint automatically assigns custom claims for role-based authorization.
