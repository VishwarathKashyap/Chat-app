import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import { useAuthStore } from '../../store/authStore';
import api from '../../config/axios';
import type { Chat, User } from '../../types';

interface SidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export function Sidebar({ selectedChat, onSelectChat }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for search
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chats');
      setChats(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load chats');
    }
  };

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true); // Set loading to true when starting the search
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/users/search?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to search users');
    } finally {
      setLoading(false); // Set loading to false once the search finishes
    }
  };

  const accessChat = async (userId: string) => {
    try {
      const { data } = await api.post('/chats', { userId });
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      onSelectChat(data);
      setSearchResults([]);
      setSearch('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create chat');
    }
  };

  return (
    <div className="h-full p-4 flex flex-col space-y-4">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="w-full p-2 text-gray-500">Searching...</div>
      )}

      {searchResults.length > 0 && !loading && (
        <div className="w-full space-y-2">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="w-full p-2 flex items-center cursor-pointer hover:bg-gray-100"
              onClick={() => accessChat(user._id)}
            >
              <img
                src="https://avatar.iran.liara.run/public/boy" // Static image URL for search results
                alt={user.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}

      <div className="w-full space-y-2 flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`w-full p-3 flex items-center cursor-pointer ${
              selectedChat?._id === chat._id ? 'bg-blue-100' : ''
            } hover:bg-gray-100`}
            onClick={() => onSelectChat(chat)}
          >
            {/* Use static image for chat avatars */}
            <img
              src="https://avatar.iran.liara.run/public/boy" // Static image URL for chats
              alt={chat.chatName || chat.users[0].username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-bold">
                {chat.isGroupChat
                  ? chat.chatName
                  : chat.users.find((u) => u._id !== user?._id)?.username}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {chat.latestMessage?.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
