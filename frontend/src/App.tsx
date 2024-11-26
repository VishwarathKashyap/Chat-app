import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthLayout, ProtectedRoute } from './components/layouts';
import { Chat, Login, Register } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
