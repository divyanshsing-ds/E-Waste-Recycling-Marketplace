import { useEffect, useState, useCallback } from 'react';

const getWebSocketUrl = (path) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || (import.meta.env.DEV ? '8000' : '');
  return `${protocol}//${host}${port ? ':' + port : ''}${path}`;
};

const useWebSocket = (path) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(3);

  useEffect(() => {
    if (!path) return;

    const url = getWebSocketUrl(path);
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      setReadyState(WebSocket.CLOSED);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setReadyState(WebSocket.CLOSED);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [path]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { socket, lastMessage, readyState, sendMessage };
};

export default useWebSocket;
export { getWebSocketUrl };
