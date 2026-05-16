import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-dark-700/80 border border-dark-500 p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-risk-red to-risk-yellow flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg shadow-risk-red/20">RA</div>
          <h2 className="text-xl font-bold text-white">Create account</h2>
          <p className="text-sm text-dark-300 mt-1">Join the risk mapping platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-risk-red/10 border border-risk-red/30 text-risk-red text-xs">{error}</div>
          )}

          <div>
            <label className="block text-xs text-dark-300 uppercase tracking-wider font-medium mb-1.5">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-dark-600 border border-dark-500 text-sm text-white placeholder-dark-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              placeholder="Your name" id="register-name" />
          </div>
          <div>
            <label className="block text-xs text-dark-300 uppercase tracking-wider font-medium mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-dark-600 border border-dark-500 text-sm text-white placeholder-dark-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              placeholder="you@example.com" id="register-email" />
          </div>
          <div>
            <label className="block text-xs text-dark-300 uppercase tracking-wider font-medium mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-dark-600 border border-dark-500 text-sm text-white placeholder-dark-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              placeholder="Min 6 characters" id="register-password" />
          </div>
          <div>
            <label className="block text-xs text-dark-300 uppercase tracking-wider font-medium mb-1.5">Role</label>
            <div className="flex gap-2">
              {[['user', '🧑 General User'], ['researcher', '🔬 Researcher']].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setRole(val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    role === val ? 'border-accent bg-accent/10 text-accent-light' : 'border-dark-500 bg-dark-600 text-dark-300 hover:border-dark-400'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors disabled:opacity-50"
            id="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-dark-300 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-light hover:underline no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
