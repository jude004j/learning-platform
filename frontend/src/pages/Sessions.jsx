import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ title: '', meet_link: '' });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // First get user profile to check role
        const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'x-auth-token': token }
        });
        const profileData = await profileRes.json();
        setUser(profileData);

        // Then get all sessions
        const res = await fetch('http://localhost:5000/api/session', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch sessions');
        setSessions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [navigate]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to create session');

      setSessions([data, ...sessions]);
      setFormData({ title: '', meet_link: '' });
      alert('Live session broadcast successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">Scanning live signals...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-red-900/10 via-orange-900/5 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              Live Hub
            </h1>
            <Link to="/dashboard" className="text-gray-400 font-bold hover:text-white transition-all flex items-center gap-2 group border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10 pt-16 relative z-10 w-full animate-fade-in-up">
        
        {/* Tutor Section: Start Session */}
        {user?.role === 'tutor' && (
          <div className="mb-20">
            <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Live Classroom</span> 🎥</h2>
            <form onSubmit={handleCreateSession} className="bg-[#1a1d24]/60 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-end gap-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
              <div className="flex-1 w-full space-y-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Session Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Master React Hooks"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all font-medium"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Google Meet Link</label>
                <input 
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={formData.meet_link}
                  onChange={(e) => setFormData({ ...formData, meet_link: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all font-medium"
                />
              </div>
              <button 
                disabled={creating}
                className="w-full md:w-auto py-4 px-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl font-bold text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {creating ? 'Starting...' : 'Go Live Now'}
              </button>
            </form>
          </div>
        )}

        {/* Global Section: Available Sessions */}
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Available Sessions 📡</h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mb-10">
            Join one of the active live sessions below to start learning directly from mentors in real-time.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-[#1a1d24]/40 border border-dashed border-white/10 p-16 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-inner">
             <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-800/40 flex items-center justify-center text-gray-600 mb-6 border border-white/5">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              </div>
             <h3 className="text-2xl font-bold mb-3">No active sessions at the moment</h3>
             <p className="text-gray-400 font-medium">Please check back in a few minutes or reach out to tutors via matches!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <div key={session._id} className="bg-[#1a1d24]/60 border border-white/5 p-8 rounded-[2.5rem] hover:bg-[#1a1d24]/80 transition-all duration-500 group relative overflow-hidden flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                {/* Visual pulse for live sessions */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Now</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-red-400 transition-colors">{session.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                      {session.tutor_id?.name?.charAt(0)}
                    </div>
                    <span className="text-gray-400 text-sm font-semibold">Hosted by {session.tutor_id?.name}</span>
                  </div>
                </div>

                <a 
                  href={session.meet_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 group/btn mt-auto shadow-xl shadow-black/20"
                >
                  Join Session
                  <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
