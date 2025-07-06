# User Creation API

This API route allows you to create users in Firebase with email, password, and role.

## Endpoint

`POST /api/users`

## Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

## Valid Roles

- `user` - Regular user
- `admin` - Administrator
- `moderator` - Moderator

## Response

### Success (201 Created)

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

### Error Responses

#### 400 Bad Request

- Missing required fields
- Invalid email format
- Password too short (minimum 6 characters)
- Invalid role

#### 409 Conflict

- User with email already exists

#### 500 Internal Server Error

- Firebase errors or other server issues

## Example Usage

### Using fetch

```javascript
const response = await fetch("/api/users", {
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

const data = await response.json();
```

### Using curl

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

## Additional Endpoint

### GET /api/users

Lists all users (for admin purposes). Returns user information including UID, email, verification status, and custom claims.

**Note:** This endpoint should be protected with proper authentication and authorization in production.
