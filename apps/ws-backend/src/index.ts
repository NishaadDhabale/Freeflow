import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == 'string') {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || '';
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== 'string') {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === 'join_room') {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === 'leave_room') {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter(
  (room) => room !== String(parsedData.roomId)
);
    }

    console.log('message received');
    console.log(parsedData);

    if (parsedData.type === 'chat') {
      const roomId = String(parsedData.roomId);
      const roomIdNumber = Number(roomId);
      const message = parsedData.message;

      if (!Number.isInteger(roomIdNumber) || roomIdNumber <= 0) {
        return;
      }

      const sender = users.find((user) => user.ws === ws);

      // Only allow messages in rooms the sender has joined
      if (!sender || !sender.rooms.includes(roomId)) {
        return;
      }

      let payload: any;

      try {
        payload = JSON.parse(message);
      } catch {
        console.error('Invalid chat message');
        return;
      }

      // Handle erase requests
      if (payload.action === 'erase') {
        const shapeId = Number(payload.shapeId);

        if (!Number.isInteger(shapeId) || shapeId <= 0) {
          return;
        }

        const deleted = await prismaClient.chat.deleteMany({
          where: {
            id: shapeId,
            roomId: roomIdNumber,
          },
        });

        // Don't broadcast a deletion if no database record was deleted
        if (deleted.count === 0) {
          return;
        }

        users.forEach((user) => {
          if (
            user.rooms.includes(roomId) &&
            user.ws.readyState === WebSocket.OPEN
          ) {
            user.ws.send(
              JSON.stringify({
                type: 'chat',
                roomId,
                message: JSON.stringify({
                  action: 'erase',
                  shapeId,
                }),
              }),
            );
          }
        });

        return;
      }

      // Save a newly drawn shape
      const savedChat = await prismaClient.chat.create({
        data: {
          roomId: roomIdNumber,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (
          user.rooms.includes(roomId) &&
          user.ws.readyState === WebSocket.OPEN
        ) {
          user.ws.send(
            JSON.stringify({
              type: 'chat',
              message,
              roomId,
              chatId: savedChat.id,
            }),
          );
        }
      });
    }
  });
});
