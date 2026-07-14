import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
      
      // Feature: optionally enforce that user logged in matches the button role clicked
      if (data.user.role !== role) {
        throw new Error(`You are registered as a ${data.user.role}, please login with the correct role.`);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] p-4 relative overflow-hidden">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-[#1a1d24]/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] w-full max-w-[420px] ring-1 ring-white/10 relative z-10 animate-fade-in-up transition-all duration-300">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20 transform rotate-3 hover:rotate-6 transition-transform">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm font-medium">Log in to enter the SkillSwap arena.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 animate-shake">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>}
        
        <div className="space-y-6">
          <div className="space-y-1.5 focus-within:text-blue-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Email Space</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium placeholder-gray-500"
                placeholder="nomad@skillswap.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
          </div>
          <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Security Key</label>
            <div className="relative">
              <input 
                type="password" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all font-medium placeholder-gray-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
            <button 
              onClick={() => handleLogin('student')}
              className="group relative w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all transform hover:-translate-y-1 border border-blue-500/30 hover:border-blue-500 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
                Student
              </span>
            </button>
            <button 
              onClick={() => handleLogin('tutor')}
              className="group relative w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all transform hover:-translate-y-1 border border-purple-500/30 hover:border-purple-500 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Tutor
              </span>
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-8">
            <span className="h-px bg-gray-700/50 w-full rounded-full"></span>
            <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">New here?</span>
            <span className="h-px bg-gray-700/50 w-full rounded-full"></span>
          </div>

          <p className="text-center mt-6">
            <Link to="/signup" className="text-white hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 group">
              Create an account
              <svg className="w-4 h-4 text-blue-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
