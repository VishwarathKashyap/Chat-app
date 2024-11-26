import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import { useAuthStore } from '../../store/authStore';
import { socket } from '../../config/socket';
import api from '../../config/axios';
import type { Chat, Message } from '../../types';

interface ChatBoxProps {
  chat: Chat | null;
}

export function ChatBox({ chat }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat) {
      fetchMessages();
      socket.emit('join chat', chat._id);
    }
  }, [chat]);

  useEffect(() => {
    socket.on('message received', (newMessage: Message) => {
      if (chat && chat._id === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('message received');
    };
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!chat) return;
    try {
      const { data } = await api.get(`/messages/${chat._id}`);
      setMessages(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;
    setLoading(true);
    try {
      const { data } = await api.post('/messages', {
        content: newMessage,
        chatId: chat._id,
      });
      socket.emit('new message', data);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col space-y-4">
      <div className="w-full p-2 border-b border-gray-300">
        <h1 className="text-xl font-bold">
          {chat.isGroupChat
            ? chat.chatName
            : chat.users.find((u) => u._id !== user?._id)?.username}
        </h1>
      </div>

      <div className="flex-1 w-full overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`w-full flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2/3 p-3 rounded-lg ${message.sender._id === user?._id ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              {/* Use the static image link for the sender's avatar */}
              {message.sender._id !== user?._id && (
                <img
                  src="https://avatar.iran.liara.run/public/boy" // Static image URL
                  alt={message.sender.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div>
                {message.sender._id !== user?._id && (
                  <p className="text-sm font-bold mb-1">{message.sender.username}</p>
                )}
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-md shadow-sm disabled:bg-blue-300"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
