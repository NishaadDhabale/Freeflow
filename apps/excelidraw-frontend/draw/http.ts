
import { HTTP_BACKEND } from '@/config';
import axios from 'axios';

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(
    `${HTTP_BACKEND}/chats/${roomId}`
  );

  const messages = res.data.messages;

  const shapes = messages.flatMap(
    (x: { id: number; message: string }) => {
      try {
        const messageData = JSON.parse(x.message);

        if (!messageData.shape) return [];

        return [
          {
            ...messageData.shape,
            id: x.id,
          },
        ];
      } catch {
        return [];
      }
    }
  );

  return shapes;
}
