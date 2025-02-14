
import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';
import { ClientToServerEvents, ServerToClientEvents } from '@/server/types';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
  const { toast } = useToast();
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();

  useEffect(() => {
    socket.current = io(SOCKET_URL);

    socket.current.on('connect', () => {
      console.log('Connected to server');
    });

    socket.current.on('error', ({ message }) => {
      console.error('Socket error:', message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from server');
      toast({
        title: 'Connection Lost',
        description: 'Lost connection to the game server. Trying to reconnect...',
        variant: 'destructive',
      });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
};

export default useSocket;
