# FreeFlow WebSocket Backend API Documentation

## Base Connection URL
ws://localhost:8080

## Authentication
The WebSocket server requires authentication via a JWT token upon connection. You must include the token as a query parameter in the connection URL.

**Connection Example:**
ws://localhost:8080?token=<your_jwt_token>

If the token is missing, invalid, or expired, the server will automatically close the connection.

## Communication Format
All messages sent between the client and the server must be **JSON-stringified** objects. 

---

# 1. Client-to-Server Events
These are the message payloads the frontend client should send to the server.

## 1.1 Join Room
**Description:** Subscribes the current WebSocket connection to a specific room to start receiving messages for that room.

**Payload:**
```json
{
  "type": "join_room",
  "roomId": "1"
}
```

## 1.2 Leave Room
Description: Unsubscribes the current WebSocket connection from a specific room.

Payload:

```json
{
  "type": "leave_room",
  "room": "1"
}
```

(Note: Ensure the property name matches exactly. The backend expects room, not roomId, for this specific event based on the current implementation).

## 1.3 Send Chat Message
Description: Broadcasts a message to a specific room and saves it to the database. The server uses the userId decoded from the connection token to associate the message with the sender in the database.

Payload:

```json
{
  "type": "chat",
  "roomId": "1",
  "message": "Hello everyone!"
}
```

# 2. Server-to-Client Events
These are the message payloads the server will broadcast to connected clients.

## 2.1 Receive Chat Message
Description: When any user in a subscribed room sends a chat message, the server broadcasts this payload to all users currently joined in that roomId.

Payload:

```json
{
  "type": "chat",
  "message": "Hello everyone!",
  "roomId": "1"
}
```

# 3. Environment Variables & Dependencies
To run this WebSocket backend successfully, the following external dependencies and configurations are required:

Database: A valid Prisma Client connection (@repo/db/client) is required to save chat messages to the database automatically.

JWT Secret: The JWT_SECRET must be accessible from @repo/backend-common/config to verify connecting clients.

# 4. Frontend Integration Example
Here is how you would integrate this WebSocket server into a frontend application (e.g., React/Next.js):

```javascript
// 1. Initialize Connection with Token
const token = localStorage.getItem('token');
const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

ws.onopen = () => {
  console.log('Connected to WebSocket server');

  // 2. Join a room once connected
  ws.send(JSON.stringify({
    type: 'join_room',
    roomId: '123'
  }));
};

// 3. Listen for incoming messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'chat') {
    console.log(`New message in room ${data.roomId}:`, data.message);
    // Update UI state with the new message
  }
};

// 4. Send a new message
const sendMessage = (roomId, messageText) => {
  ws.send(JSON.stringify({
    type: 'chat',
    roomId: roomId,
    message: messageText
  }));
};

// 5. Clean up on component unmount
const leaveRoom = () => {
  ws.send(JSON.stringify({
    type: 'leave_room',
    room: '123'
  }));
  ws.close();
};
```

# 5. Developer Notes / Potential Fixes

Leave Room Logic Issue: In the current index.ts file, the leave room logic is written as:

```typescript
user.rooms = user?.rooms.filter((x) => x === parsedData.room);
```

This logic actually removes all rooms except the one the user is trying to leave. To correctly remove the requested room, you should change the === to !==:

```typescript
// Corrected logic:
user.rooms = user?.rooms.filter((x) => x !== parsedData.room);
```

Room ID Data Types: The join_room array stores roomId exactly as it comes from the client (usually a string or number). However, the Prisma create call wraps it in Number(roomId). Ensure the frontend sends a consistent type, or coerce the types predictably when checking user.rooms.includes(roomId) during the broadcast phase to prevent silent failures.
