import { useRef, useEffect } from 'react';

function useWebSocket(url, onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => {
      console.log("WebSocket conectado");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket desconectado");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage]);

  const sendMessage = (data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  return { sendMessage, isConnected: ws.current?.readyState === WebSocket.OPEN };
}

export default useWebSocket;