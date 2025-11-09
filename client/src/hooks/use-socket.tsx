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

    socketRef.current.emit('subscribe_order', orderId);
    socketRef.current.on('ORDER_UPDATE', (update: OrderUpdate) => {
      if (update.orderId === orderId) {
        callback(update);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('unsubscribe_order', orderId);
        socketRef.current.off('ORDER_UPDATE');
      }
    };
  };

  return {
    isConnected,
    subscribeToOrder,
    socket: socketRef.current,
  };
}
