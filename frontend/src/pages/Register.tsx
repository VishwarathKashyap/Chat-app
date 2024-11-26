import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../config/axios';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/register', {
        username,
        email,
        password,
      });
      setUser(data);
      navigate('/', { replace: true });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Something went wrong'); // Simple alert for error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <div className="text-2xl font-bold text-center">Register</div>
      
      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block font-medium text-sm" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="text-center">
        <span>Already have an account? </span>
        <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </div>
    </form>
  );
}
