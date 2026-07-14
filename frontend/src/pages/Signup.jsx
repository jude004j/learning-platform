import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Signup failed');
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
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

      <div className="bg-[#1a1d24]/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] w-full max-w-[460px] ring-1 ring-white/10 relative z-10 animate-fade-in-up transition-all duration-300 my-8">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-tight">Join <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SkillSwap</span></h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl mb-6 text-sm font-medium flex items-start gap-2 animate-shake">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>}
        {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3.5 rounded-xl mb-6 text-sm font-medium flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="leading-tight">{success}</span>
        </div>}
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1.5 focus-within:text-blue-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <input 
                name="name"
                type="text" 
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium placeholder-gray-500"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>
          <div className="space-y-1.5 focus-within:text-blue-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium placeholder-gray-500"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
          </div>
          <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <input 
                name="password"
                type="password"
                required
                minLength="6"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all font-medium placeholder-gray-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
          <div className="space-y-1.5 focus-within:text-indigo-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">I want to be a</label>
            <div className="relative">
              <select 
                name="role"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer font-medium"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student (Learning)</option>
                <option value="tutor">Tutor (Teaching)</option>
              </select>
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
          
          <div className="flex items-center justify-center mt-6">
            <span className="h-px bg-gray-700/50 w-full rounded-full"></span>
            <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">Or</span>
            <span className="h-px bg-gray-700/50 w-full rounded-full"></span>
          </div>

          <p className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors inline-block hover:-translate-y-0.5 transform">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
