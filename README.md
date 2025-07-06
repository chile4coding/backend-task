# Junior Backend Development Assessment - Project Documentation

## Project Overview

A **Next.js** application with **Firebase backend** that supports authentication, secure CRUD operations on products, and role-based access using **Next.js API routes** and **Firestore**.

---

## Tech Stack

- **Next.js 15.3.5** (App Router + API routes)
- **Firebase Authentication** & **Firestore**
- **TypeScript**
- **Axios** for HTTP requests
- **Firebase Admin SDK** in API routes for secure server-side logic
- **Tailwind CSS** for styling
- **JWT** for session management

---

## Authentication System

### Features

- **Sign up** and **log in** with email/password
- **Log out** functionality
- **Role-based access** (user/admin)
- **Session management** with JWT tokens
- **Real-time user state** updates

### API Endpoints

#### `POST /api/auth/signup`

Creates a new user account with email, password, and role.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

**Valid Roles:** `user`, `admin`

#### `POST /api/auth/login`

Authenticates a user and returns their information.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### `POST /api/auth/logout`

Handles user logout and clears server-side session data.

---

## Product Management System

### API Route: `/api/products`

This route supports all required CRUD operations:

| Method   | Endpoint            | Description                       | Authentication                  |
| -------- | ------------------- | --------------------------------- | ------------------------------- |
| `GET`    | `/api/products`     | Return **all products**           | Public                          |
| `GET`    | `/api/products/:id` | Return **single product details** | Public                          |
| `POST`   | `/api/products`     | Create new product                | **Logged-in users only**        |
| `PUT`    | `/api/products/:id` | Update product                    | **Only if created by the user** |
| `DELETE` | `/api/products/:id` | Delete product                    | **Only if created by the user** |

### Product Schema

Each product contains the following fields:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdBy: string; // User ID of the creator
  createdAt: string; // Timestamp
}
```

### Authorization Logic

- **Public access** to view all products and individual product details
- **Authentication required** to create new products
- **Ownership validation** - users can only edit/delete products they created
- **Admin privileges** - admins can view all products and user information

---

## Frontend Features

### Product Display

- **Table listing all products** with comprehensive information
- **Clickable product names** to view full details
- **Responsive design** for mobile and desktop
- **Loading states** and error handling

### Product Management

- **Create product form** (modal) for logged-in users
- **Edit product functionality** - only for products created by the logged-in user
- **Delete product functionality** - only for products created by the logged-in user
- **Real-time updates** after CRUD operations

### User Interface

- **Navigation bar** with authentication status
- **Dashboard** for user's own products
- **Product detail pages** with creator information
- **Admin panel** for administrative functions

---

## Technical Implementation

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD endpoints
│   │   └── users/         # User management endpoints
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (AuthContext)
│   ├── dashboard/         # User dashboard
│   └── [id]/              # Dynamic product detail pages
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── products.ts       # Product business logic
│   └── axios/            # HTTP client configuration
├── types/                # TypeScript type definitions
└── middleware.ts         # Route protection middleware
```

### Key Features

#### Authentication & Authorization

- **Firebase Authentication** for user management
- **JWT tokens** for session management
- **Middleware** for route protection
- **Role-based access control** (user/admin)
- **Ownership validation** for product operations

#### Security

- **Server-side validation** for all inputs
- **Authentication required** for protected routes
- **Ownership checks** before allowing edit/delete
- **Secure cookie handling** for sessions
- **Error handling** without exposing sensitive information

#### Data Management

- **Firestore** for data persistence
- **Real-time updates** through React context
- **Optimistic updates** for better UX
- **Proper error handling** and loading states

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd junuior-backend-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Firebase configuration:

   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   JWT_SECRET=your-jwt-secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Testing the Application

### 1. Authentication Flow

1. Visit the homepage
2. Click "Sign Up" to create a new account
3. Fill in email, password, and role
4. Click "Login" to authenticate
5. Verify you can see the dashboard

### 2. Product Management

1. **Create a product:**

   - Click "Add New Product" on dashboard
   - Fill in name, description, and price
   - Submit the form

2. **View products:**

   - Browse all products on homepage
   - Click product names to view details
   - Check your products on dashboard

3. **Edit/Delete products:**
   - Only your own products show edit/delete buttons
   - Test editing product information
   - Test deleting products

### 3. Authorization Testing

1. **Create products** with different user accounts
2. **Verify ownership** - users can only edit their own products
3. **Test admin access** - admin users can see all products
4. **Test logout** - session clearing works properly

---

## API Documentation

### Authentication Endpoints

#### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

### Product Endpoints

#### Get All Products

```bash
curl -X GET http://localhost:3000/api/products
```

#### Get Single Product

```bash
curl -X GET http://localhost:3000/api/products/{product-id}
```

#### Create Product (requires authentication)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: session={your-session-token}" \
  -d '{
    "name": "Sample Product",
    "description": "A sample product description",
    "price": 29.99
  }'
```

#### Update Product (requires ownership)

```bash
curl -X PUT http://localhost:3000/api/products/{product-id} \
  -H "Content-Type: application/json" \
  -H "Cookie: session={your-session-token}" \
  -d '{
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 39.99
  }'
```

#### Delete Product (requires ownership)

```bash
curl -X DELETE http://localhost:3000/api/products/{product-id} \
  -H "Cookie: session={your-session-token}"
```

---

## Evaluation Criteria Met

### Core Requirements

- **Next.js API routes** - Correctly implemented for all CRUD operations
- **Secure CRUD backend** - Proper authentication and authorization
- **Firebase Auth + Firestore** - Full integration with best practices
- **Authorization logic** - Users can only edit/delete their own products
- **Clean, maintainable code** - Well-structured and modular
- **TypeScript** - Full type safety throughout the application

### Bonus Features

- **Middleware implementation** - Route protection with JWT verification
- **Helper utilities** - Authentication, validation, and business logic utilities
- **Proper error handling** - Comprehensive error handling and validation
- **Real-time updates** - AuthContext for instant UI updates
- **Role-based access** - Admin vs user permissions
- **Responsive design** - Mobile-friendly interface

---

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all Firebase configuration and JWT secret are properly set in your production environment.

---

## Notes

- **Firebase Admin SDK** is used in API routes for secure server-side operations
- **JWT tokens** are used for session management with proper expiration
- **Middleware** protects routes and validates user sessions
- **TypeScript** provides full type safety and better development experience
- **Error handling** is implemented throughout the application
- **Responsive design** ensures the application works on all devices

---

## Contributing

This project was built as part of a Junior Backend Development assessment. The code demonstrates:

- Understanding of Next.js and Firebase integration
- Implementation of secure authentication and authorization
- Clean, maintainable code practices
- Attention to user experience and error handling
- Production-ready application structure

---

**Built with Next.js, Firebase, and TypeScript**
