import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch current user to identify who is the "other" person in connection
        const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'x-auth-token': token }
        });
        const profileData = await profileRes.json();
        setCurrentUser(profileData);

        const res = await fetch('http://localhost:5000/api/connections', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch connections');
        setConnections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">
      Syncing your network...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-900/20 via-blue-900/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              Connections
            </h1>
            <Link to="/dashboard" className="text-gray-400 font-bold hover:text-white transition-all flex items-center gap-2 group border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 sm:p-10 pt-16 relative z-10 w-full animate-fade-in-up">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            My Network 🌐
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Collaborate with users you've successfully matched with. Start a learning session now!
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="bg-[#1a1d24]/60 border border-white/5 p-12 rounded-[2rem] text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-800 flex items-center justify-center text-gray-500 mb-6 border border-gray-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </div>
            <h3 className="text-2xl font-bold mb-3">No connections yet</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              Once you accept a request or your request is accepted, connections will appear here. Go to the dashboard to find new matches!
            </p>
            <Link to="/matches" className="inline-block mt-8 py-3 px-8 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {connections.map((conn) => {
              const otherUser = conn.sender._id === currentUser?._id ? conn.receiver : conn.sender;
              return (
                <div key={conn._id} className="bg-[#1a1d24]/60 border border-white/5 p-8 rounded-[2.5rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_20px_40px_-15px_rgba(34,211,238,0.1)] flex flex-col items-center text-center">
                  
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-xl shadow-cyan-500/20 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{otherUser.name}</h3>
                  <p className="text-gray-400 text-sm font-semibold mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 01-2 2z"></path></svg>
                    {otherUser.email}
                  </p>

                  <div className="w-full bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Target Skill</span>
                    <span className="text-cyan-400 font-extrabold text-lg">{conn.skill}</span>
                  </div>

                  <button 
                    onClick={() => navigate('/sessions')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    Start Learning
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
