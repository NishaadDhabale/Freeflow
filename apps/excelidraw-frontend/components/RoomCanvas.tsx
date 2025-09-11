'use client';

import { WS_URL } from '@/config';
import { useEffect, useRef, useState } from 'react';
import { Canvas } from './Canvas';

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGRmOGY3Zi1kN2ExLTRmMmUtYTVhYy05ZGZhYjNhODg4MjgiLCJpYXQiOjE3NTQ5MDA4ODJ9.zkcodQJcB2Wo3DQTDufNiiKsz8jwKtabUFt0ORF70zk`
    );
    ws.onopen = () => {
      console.log("we are here")
      setSocket(ws);
      const data = JSON.stringify({
        type: 'join_room',
        roomId,
      });
      console.log(data);
      ws.send(data);
    };
  }, []);
  if (!socket) {
    return <div>Connecting to the server</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
