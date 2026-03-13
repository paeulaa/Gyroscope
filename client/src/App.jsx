import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ControllerView from './component/ControllerView.jsx';
import DisplayView from './component/DisplayView.jsx';

const SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";
// const SERVER_URL = "https://192.168.50.162:3000";


const App = () => {
  const [mode, setMode] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Status: connecting to WebSocket...');
  const [isConnected, setIsConnected] = useState(false);
  
  const [socket] = useState(() => io(SERVER_URL, {
    transports: ['websocket'],
    upgrade: false,
    forceNew: true,
    path: '/socket.io/',
    // 💡 Dealing with the error of Ngrok connection
    extraHeaders: {
      "ngrok-skip-browser-warning": "69420" // fill in any string, ngrok will skip the warning
    }
  }));

  useEffect(() => {
    // 定義監聽邏輯
    const onConnect = () => {
      setIsConnected(true);
      setStatusMessage(`Status: connected (ID: ${socket.id.substring(0, 5)})`);
    };

    const onConnectError = (err) => {
      console.error("Socket connection detailed error:", err); // check the detailed object in the F12 console
      setStatusMessage(`Status: connection error - ${err.message}`);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setStatusMessage('Status: connection interrupted');
    };

    // 綁定事件
    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    // 清理函數：當 App 組件卸載時斷開連線
    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  const goBackToModeSelection = () => {
    setMode(null);
    setStatusMessage('Status: returned to mode selection');
  };

  const renderContent = () => {
    // 如果還沒連上，顯示載入中
    if (!isConnected && !mode) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <p className="text-xl font-semibold text-yellow-600 animate-pulse">{statusMessage}</p>
        </div>
      );
    }

    if (mode === 'controller') {
      return (
        <ControllerView 
          socket={socket}
          goBack={goBackToModeSelection}
          setStatus={setStatusMessage}
        />
      );
    }

    if (mode === 'display') {
      return (
        <DisplayView 
          socket={socket}
          goBack={goBackToModeSelection}
          setStatus={setStatusMessage}
        />
      );
    }

    // initial mode selection screen
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
        <p className="text-lg">Please select the device mode:</p>
        <div className="flex" style={{ gap: '48px' }}>
          <button 
            onClick={() => setMode('controller')} 
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg"
          >
            📱 Mobile controller
          </button>
          <button 
            onClick={() => setMode('display')} 
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg"
          >
            💻 Computer display
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {mode !== 'display' && (
        <header className="p-4 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Gyro Remote (WS)</h1>
          <span className="text-sm font-medium text-gray-500">{statusMessage}</span>
        </header>
      )}
      {renderContent()}
    </div>
  );
};

export default App;