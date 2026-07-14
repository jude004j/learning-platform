import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const [formData, setFormData] = useState({
    skills_offered: '',
    skills_wanted: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Error fetching profile');
        
        // Convert arrays to comma-separated strings for inputs
        setFormData({
          skills_offered: data.skills_offered?.join(', ') || '',
          skills_wanted: data.skills_wanted?.join(', ') || ''
        });
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    // Convert comma-separated string back to trimmed array
    const splitSkills = (str) => 
      str ? str.split(',').map(skill => skill.trim()).filter(skill => skill !== '') : [];

    const payload = {
      skills_offered: splitSkills(formData.skills_offered),
      skills_wanted: splitSkills(formData.skills_wanted)
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error saving profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Feature: Redirect back to dashboard out after brief pause
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">Loading skillset...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="bg-[#1a1d24]/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] w-full max-w-[500px] ring-1 ring-white/10 relative z-10 animate-fade-in-up transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-xl group">
             <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </Link>
           <h2 className="text-2xl font-bold text-center text-white tracking-tight">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Skills</span></h2>
           <div className="w-9 h-9 opacity-0"></div>{/* Spacer */}
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${
            message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400 animate-shake'}`
          }>
             <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {message.type === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> }
             </svg>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Skills Offered</label>
            <p className="text-gray-500 text-xs ml-1 mb-2 leading-tight">What subjects can you teach? (Separate with commas)</p>
            <div className="relative">
              <input 
                name="skills_offered"
                type="text" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all font-medium placeholder-gray-600"
                placeholder="e.g. React, Calculus, Python Level 1"
                value={formData.skills_offered}
                onChange={handleChange}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
          </div>

          <div className="space-y-1.5 focus-within:text-blue-400 transition-colors pt-2">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">Skills Wanted</label>
            <p className="text-gray-500 text-xs ml-1 mb-2 leading-tight">What subjects are you eager to learn? (Separate with commas)</p>
            <div className="relative">
              <input 
                name="skills_wanted"
                type="text" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium placeholder-gray-600"
                placeholder="e.g. Graphic Design, Guitar"
                value={formData.skills_wanted}
                onChange={handleChange}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full mt-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            )}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
