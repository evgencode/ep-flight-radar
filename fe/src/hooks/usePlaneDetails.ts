import { useEffect, useRef, useState } from 'react';
import { WS_DETAILS_URL } from '../config';
import { ReconnectingSocket } from '../lib/ReconnectingSocket';
import type { PlaneDetailed, SubscribeMessage } from '../types/plane';

type DetailsState = {
  planeId: string;
  details: PlaneDetailed | null;
  error: string | null;
};

/**
 * Streams detailed data for the selected plane.
 * A single details socket is kept open while something is selected;
 * switching planes re-sends `subscribe`, deselecting closes the socket.
 */
export function usePlaneDetails(planeId: string | null) {
  const [state, setState] = useState<DetailsState | null>(null);
  const socketRef = useRef<ReconnectingSocket | null>(null);
  const planeIdRef = useRef<string | null>(planeId);

  useEffect(() => {
    planeIdRef.current = planeId;

    if (!planeId) {
      socketRef.current?.stop();
      socketRef.current = null;
      return;
    }

    const subscribe = (socket: ReconnectingSocket, id: string) => {
      socket.send({
        type: 'subscribe',
        planeId: id,
      } satisfies SubscribeMessage);
    };

    // Already connected: switch subscription. If still connecting, onOpen will subscribe.
    if (socketRef.current) {
      // just update subscription
      subscribe(socketRef.current, planeId);
      return;
    }

    const socket = new ReconnectingSocket(WS_DETAILS_URL, {
      onOpen: () => subscribe(socket, planeId),
      onMessage: message => {
        const current = planeIdRef.current;
        if (!current) return;

        if (message.type === 'plane-details') {
          // Ignore late updates for a previously selected plane.
          if (message.data.id === current) {
            setState({ planeId: current, details: message.data, error: null });
          }
        } else if (message.type === 'error') {
          setState({ planeId: current, details: null, error: message.message });
          // Server closes the connection for unknown planes - don't reconnect in a loop.
          if (/not found/i.test(message.message) && socketRef.current === socket) {
            socket.stop();
            socketRef.current = null;
          }
        }
      },
    });

    socketRef.current = socket;
    socket.start();
  }, [planeId]);

  useEffect(
    () => () => {
      socketRef.current?.stop();
      socketRef.current = null;
    },
    [],
  );

  const current = state && state.planeId === planeId ? state : null;
  return {
    details: current?.details ?? null,
    error: current?.error ?? null,
    loading: planeId !== null && !current,
  };
}
