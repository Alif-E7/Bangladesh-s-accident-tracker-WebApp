import { Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import ZoneDetail from '@/pages/ZoneDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/zones/:id" element={<ZoneDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Routes>
        <Route path="/" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
}
