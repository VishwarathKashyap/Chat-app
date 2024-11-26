import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatBox } from '../components/chat/ChatBox';
import { socket } from '../config/socket';
import type { Chat } from '../types';

export function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (user) {
      socket.emit('setup', user);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative flex h-screen p-4 gap-4">
      <div className="w-full sm:w-1/3 lg:w-1/4 bg-white border border-gray-300 rounded-lg">
        <Sidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </div>
      <div className="flex-1 bg-white border border-gray-300 rounded-lg">
        <ChatBox chat={selectedChat} />
      </div>
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
