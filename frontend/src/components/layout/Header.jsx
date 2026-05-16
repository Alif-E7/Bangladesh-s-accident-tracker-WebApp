import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-risk-red to-risk-yellow flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-risk-red/20">
            RA
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-white leading-tight">Road Accident</h1>
            <p className="text-[11px] text-dark-200 leading-tight">Risk Map — Bangladesh</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" active={isActive('/')}>
            <MapIcon /> Map
          </NavLink>
          <NavLink to="/dashboard" active={isActive('/dashboard')}>
            <ChartIcon /> Dashboard
          </NavLink>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors text-sm text-dark-100"
                id="user-menu-button"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-light capitalize">{user?.role}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl bg-dark-700 border border-dark-500 shadow-2xl py-2 animate-fade-in" id="user-dropdown">
                  <div className="px-4 py-2 border-b border-dark-500">
                    <p className="text-xs text-dark-200">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-dark-100 hover:bg-dark-600 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm text-dark-100 hover:text-white rounded-lg hover:bg-dark-600 transition-colors no-underline"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm bg-accent hover:bg-accent-light text-white rounded-lg transition-colors no-underline font-medium"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-600 text-dark-200"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-dark-500 py-2 px-4 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-dark-100 hover:text-white no-underline">🗺️ Map</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-dark-100 hover:text-white no-underline">📊 Dashboard</Link>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm no-underline transition-all ${
        active
          ? 'bg-accent/15 text-accent-light font-medium'
          : 'text-dark-200 hover:text-white hover:bg-dark-600'
      }`}
    >
      {children}
    </Link>
  );
}

function MapIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 3.5l4.5-2 5 2 4.5-2v11l-4.5 2-5-2-4.5 2V3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 1.5v11M10.5 3.5v11" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function ChartIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="6.5" y="4" width="3" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="12" y="1" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
}
