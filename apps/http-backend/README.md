Here is the detailed README documentation for your `http-backend` based on the provided source code, following the structure you requested.

```markdown
# FreeFlow HTTP Backend API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
Protected endpoints require authentication via a JWT token. Include the token in the `Authorization` header of your request:
```
Authorization: <your_jwt_token>
```
*(Note: Ensure the exact token string is passed as verified by the middleware).*

## Response Format
Responses generally return direct JSON objects based on the request's success or failure. Error responses will typically include a `message` field, and occasionally an `error` field detailing the exact validation failure.
```json
{
  "message": "Response message string",
  "error": { ... } 
}
```

---

# 1. Authentication APIs

## 1.1 Sign Up
**POST** `/signup`

**Access:** Public

**Description:** Register a new user account. Note that the schema maps the `username` field to the user's `email` in the database.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "securepassword123",
  "name": "Nishaad"
}
```

**Response (Success):**
```json
{
  "userId": "uuid-string-of-new-user"
}
```

**Response (Error - Invalid Inputs):**
```json
{
  "message": "Incorrect inputs"
}
```

## 1.2 Sign In
**POST** `/signin`

**Access:** Public

**Description:** Authenticate an existing user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - Not Found/Wrong Credentials):**
```json
{
  "message": "Not authorized"
}
```

---

# 2. Room Management APIs

## 2.1 Create Room
**POST** `/room`

**Access:** Authenticated users

**Headers:**
```
Authorization: <token>
```

**Description:** Create a new drawing/chat room. The user creating the room will automatically be assigned as the `adminId`.

**Request Body:**
```json
{
  "name": "my-awesome-room-slug"
}
```

**Response (Success):**
```json
{
  "roomId": 1
}
```

**Response (Error - Slug already exists):**
```json
{
  "message": "Room already exists with this name"
}
```

## 2.2 Get User's Rooms
**GET** `/rooms`

**Access:** Authenticated users

**Headers:**
```
Authorization: <token>
```

**Description:** Retrieves a list of up to 50 rooms where the currently authenticated user is the admin.

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "slug": "my-awesome-room-slug",
      "createdAt": "2024-01-17T10:30:00.000Z",
      "adminId": "uuid-string-of-user"
    }
  ]
}
```

## 2.3 Get Room by Slug
**GET** `/room/:slug`

**Access:** Public

**Description:** Fetches the details of a specific room using its unique slug.

**Response:**
```json
{
  "room": {
    "id": 1,
    "slug": "my-awesome-room-slug",
    "createdAt": "2024-01-17T10:30:00.000Z",
    "adminId": "uuid-string-of-user"
  }
}
```

---

# 3. Chat APIs

## 3.1 Get Room Chats
**GET** `/chats/:roomId`

**Access:** Public

**Description:** Retrieves the latest 50 chat messages for a specific room ID, ordered by the newest first (descending).

**Response (Success):**
```json
{
  "messages": [
    {
      "id": 150,
      "roomId": 1,
      "message": "Hello everyone!",
      "userId": "uuid-string-of-sender"
    }
  ]
}
```

**Response (Error - Database failure):**
```json
{
  "messages": []
}
```

---

# 4. Error Responses

The API uses standard HTTP status codes combined with JSON messages to indicate errors:

## 403 Forbidden / Unauthorized
Returned when authentication fails, a token is missing, or credentials don't match during sign-in.
```json
{
  "message": "Unauthorized" 
}
```

## 411 Length Required / Custom Validation
Used in this API to indicate either Zod validation failures or database constraint failures (like trying to create a room slug that already exists).
```json
{
  "message": "Incorrect inputs"
}
```

---

# 5. Environment Variables

To run this backend properly, the following environment variables are required:

```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/freeflow"

# JWT Secret for signing tokens
JWT_SECRET="your-super-secret-jwt-key"
```

*(Note: The `JWT_SECRET` is imported from `@repo/backend-common/config`, so ensure it is accessible in your monorepo setup).*

---

# 6. Frontend Integration Examples

## Sign In Flow
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {
    // Store token securely
    localStorage.setItem('token', data.token);
  } else {
    console.error(data.message);
  }

  return data;
};
```

## Creating a Room (Authenticated Request)
```javascript
const createRoom = async (roomName) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3001/room', {
    method: 'POST',
    headers: {
      'Authorization': token, // Backend middleware expects raw token in this header
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: roomName })
  });

  return await response.json();
};
```

## Fetching Chats for a Room
```javascript
const getRoomChats = async (roomId) => {
  const response = await fetch(`http://localhost:3001/chats/${roomId}`);
  const data = await response.json();
  
  return data.messages || [];
};
```

---

# 7. Best Practices

## Token Management
1. Pass the exact JWT token into the `Authorization` header as `req.headers['authorization']` expects the string directly.
2. Store tokens securely on the frontend (e.g., in HttpOnly cookies or protected memory if possible).

## Validation & Type Safety
1. The backend heavily utilizes Zod (`CreateUserSchema`, `SigninSchema`, `CreateRoomSchema`) from the `@repo/common` package. Ensure your frontend forms align perfectly with these schemas to avoid `411 Incorrect inputs` errors.
2. Usernames during `/signup` map to the `email` column in the database; ensure UI labels reflect this to avoid user confusion.
```
