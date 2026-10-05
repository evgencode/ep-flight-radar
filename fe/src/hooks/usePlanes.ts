import { useEffect, useState } from 'react';
import { WS_BASIC_URL } from '../config';
import { ReconnectingSocket, type SocketStatus } from '../lib/ReconnectingSocket';
import type { PlaneBasic } from '../types/plane';

/** Subscribes to the basic broadcast of all planes. */
export function usePlanes() {
  const [planes, setPlanes] = useState<PlaneBasic[]>([]);
  const [status, setStatus] = useState<SocketStatus>('connecting');

  useEffect(() => {
    const socket = new ReconnectingSocket(WS_BASIC_URL, {
      onStatusChange: setStatus,
      onMessage: message => {
        if (message.type === 'planes') {
          setPlanes(message.data);
        }
      },
    });
    socket.start();
    return () => {
      socket.stop();
    };
  }, []);

  return { planes, status };
}
