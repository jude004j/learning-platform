import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/match', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch matches');
        
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [navigate]);

  const [requestStatus, setRequestStatus] = useState({}); // Tracking request status by match ID

  const handleRequest = async (receiverId, skill) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ receiver_id: receiverId, skill })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Request failed');
      
      setRequestStatus(prev => ({ ...prev, [receiverId]: 'sent' }));
      alert('Request sent successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">Finding perfect matches...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              Match Finder
            </h1>
            <Link to="/dashboard" className="text-gray-400 font-bold hover:text-white transition-all flex items-center gap-2 group border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10 pt-16 relative z-10 w-full animate-fade-in-up">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Your Connections🎯
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">
            We've scanned our network and found these users who offer the exactly skills you're looking to learn! Reach out to start your knowledge exchange.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-[#1a1d24]/60 border border-white/5 p-12 rounded-[2rem] text-center max-w-2xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-800 flex items-center justify-center text-gray-500 mb-6 border border-gray-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
            <h3 className="text-2xl font-bold mb-3">No immediate matches found</h3>
            <p className="text-gray-400 font-medium leading-relaxed mb-6">
              It seems no one currently offers the exact skills you've requested. You can update your profile or check back later!
            </p>
            <Link to="/profile" className="inline-flex py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20">
              Broaden your skillset 
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <div key={match._id} className="bg-[#1a1d24]/60 border border-white/5 p-8 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-indigo-500/30 flex flex-col h-full">
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-purple-500/20 transform group-hover:-rotate-3 transition-transform">
                    {match.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-1 line-clamp-1">{match.name}</h3>
                    <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/10 text-gray-300">
                      {match.role}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">They offer:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.skills_offered?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-sm font-semibold tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleRequest(match._id, match.skills_offered[0])}
                  disabled={requestStatus[match._id] === 'sent'}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 mt-auto group/btn flex items-center justify-center gap-2
                    ${requestStatus[match._id] === 'sent' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400 cursor-default hover:translate-y-0' 
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white'}`}
                >
                  {requestStatus[match._id] === 'sent' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Request Sent
                    </>
                  ) : (
                    <>
                      Request Match
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
