import React, { useState } from 'react';
import io from 'socket.io-client';

const ChatRoom: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [room, setRoom] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [problemsArray, setProblemsArray] = useState<{ Name: string; Difficulty: string }[]>([]);

  // Connect to socket server
  useState(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleCreateRoom = () => {
    if (room.trim() === '' || name.trim() === '') {
      alert('Please enter both room name and LeetCode username');
      return;
    }
    socket?.emit('join', { room, name });
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socket?.emit('chat message', { message });
      setMessage('');
    }
  };

  const handleAddProblem = () => {
    if (problemName.trim() !== '' && difficulty.trim() !== '') {
      setProblemsArray([...problemsArray, { Name: problemName, Difficulty: difficulty }]);
    } else {
      alert('Please enter a problem name and select a difficulty.');
    }
     };

 return(
      <div>
        <h1>LeetArena</h1>
        <div>
          <input type="text" placeholder="Room name" value={room} onChange={(e) => setRoom(e.target.value)} />
          <input type="text" placeholder="LeetCode username" value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleCreateRoom}>Enter Room</button>
        </div>
        <div>
          <h2>Chat</h2>
          <ul>
            {/* Display chat messages here */}
          </ul>
          <input type="text" placeholder="Chat" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <div>
          <h2>Problemset</h2>
          <input type="text" placeholder="Problem name" value={problemName} onChange={(e) => setProblemName(e.target.value)} />
          {/* Dropdown for difficulty */}
          <button onClick={handleAddProblem}>Add</button>
          {/* Display problems list here */}
      </div>
      </div>
    
  );
  }



export default ChatRoom; 
