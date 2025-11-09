import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface OrderUpdate {
  orderId: string;
  status: string;
  etaMinutes?: number;
  vendorNote?: string;
  updatedAt: string;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef<Map<string, Array<(update: OrderUpdate) => void>>>(new Map());

  useEffect(() => {
    socketRef.current = io({
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const subscribeToOrder = (orderId: string, callback: (update: OrderUpdate) => void) => {
    if (!socketRef.current) return () => {};

    const handler = (update: OrderUpdate) => {
      if (update.orderId === orderId) {
        callback(update);
      }
    };

    if (!listenersRef.current.has(orderId)) {
      listenersRef.current.set(orderId, []);
      socketRef.current.emit('subscribe_order', orderId);
    }
    
    listenersRef.current.get(orderId)!.push(handler);
    socketRef.current.on('ORDER_UPDATE', handler);

    return () => {
      if (socketRef.current) {
        const handlers = listenersRef.current.get(orderId);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) {
            handlers.splice(index, 1);
            socketRef.current.off('ORDER_UPDATE', handler);
            
            if (handlers.length === 0) {
              listenersRef.current.delete(orderId);
              socketRef.current.emit('unsubscribe_order', orderId);
            }
          }
        }
      }
    };
  };

  return {
    isConnected,
    subscribeToOrder,
    socket: socketRef.current,
  };
}
