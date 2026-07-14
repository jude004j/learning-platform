import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [aiData, setAiData] = useState({ skillSuggestions: [], tutorSuggestions: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'x-auth-token': token }
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.msg);
        setUser(profileData);

        // Fetch AI Suggestions
        const aiRes = await fetch('http://localhost:5000/api/ai/suggestions', {
          headers: { 'x-auth-token': token }
        });
        const aiResult = await aiRes.json();
        if (aiRes.ok) setAiData(aiResult);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen text-white bg-gray-900 flex items-center justify-center text-xl font-medium animate-pulse">Loading amazing things...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-900/20 via-purple-900/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-900/20 via-blue-900/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-4000"></div>
      
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              SkillSwap
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 font-medium hidden sm:inline-block">Logged in as <span className="text-white font-bold">{user.name.split(' ')[0]}</span></span>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-bold text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 hover:bg-red-500/20 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10 pt-16 relative z-10">
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user.name.split(' ')[0]}!</span> 👋
          </h2>
          <p className="text-gray-400 text-lg font-medium">Manage your {user.role === 'student' ? 'learning journey' : 'tutoring sessions'} from your personalized arena.</p>
        </div>

        {/* AI Suggestions Section */}
        {user.role === 'student' && (
          <div className="mb-12 animate-fade-in-up animation-delay-500">
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <svg className="w-40 h-40 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">🤖</div>
                  <h3 className="text-2xl font-bold tracking-tight">AI Insights & Recommendations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Skill Suggestions */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 ml-1">Suggested Next Skills</h4>
                    {aiData.skillSuggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {aiData.skillSuggestions.map((skill, idx) => (
                          <span key={idx} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-sm font-bold animate-pulse hover:animate-none transition-all cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Add "Python" or "HTML" to see smart recommendations.</p>
                    )}
                  </div>

                  {/* Tutor Suggestions */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-1">Top Matches For You</h4>
                    {aiData.tutorSuggestions.length > 0 ? (
                      <div className="space-y-3">
                        {aiData.tutorSuggestions.map((tutor, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group/item">
                            <div>
                              <p className="font-bold text-white text-sm">{tutor.name}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">Teaches: {tutor.skills_offered.slice(0, 2).join(', ')}</p>
                            </div>
                            <Link to="/matches" className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No tutor suggestions yet. Broaden your wanted skills!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Skills Card */}
          <div className="bg-[#1a1d24]/60 border border-white/5 p-6 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-blue-500/30">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h4 className="text-xl font-bold mb-2 tracking-tight">Skills {user.role === 'student' ? 'Wanted' : 'Offered'}</h4>
            {user.role === 'student' ? (
              user.skills_wanted && user.skills_wanted.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills_wanted.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs mb-4">Update profile to see tutors.</p>
              )
            ) : (
               user.skills_offered && user.skills_offered.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills_offered.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs mb-4">Add skills to start teaching.</p>
              )
            )}
            <Link to="/profile" className="inline-flex py-2 px-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500 hover:text-white items-center gap-2 transition-all">
              Edit Profile
            </Link>
          </div>
          
          {/* Inbox/Network Card */}
          <div className="bg-[#1a1d24]/60 border border-white/5 p-6 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-indigo-500/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h4 className="text-xl font-bold mb-2 tracking-tight">Network</h4>
            <p className="text-gray-400 text-xs mb-4">Manage requests and explore matches.</p>
            <div className="flex flex-col gap-2">
              <Link to="/connections" className="py-2 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500 hover:text-white text-center transition-all">My Connections 🤝</Link>
              <Link to="/matches" className="py-2 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500 hover:text-white text-center transition-all">Explore Matches</Link>
              <Link to="/requests" className="py-2 px-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500 hover:text-white text-center transition-all">Inbox</Link>
            </div>
          </div>

          {/* Live Sessions Card */}
          <div className="bg-[#1a1d24]/60 border border-white/5 p-6 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-red-500/30">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              <div className="px-2 py-0.5 bg-red-500/10 text-[8px] font-extrabold text-red-500 border border-red-500/20 rounded-full animate-pulse uppercase tracking-widest">Live</div>
            </div>
            <h4 className="text-xl font-bold mb-2 tracking-tight">Live Hub</h4>
            <p className="text-gray-400 text-xs mb-4">Real-time sessions and workshops.</p>
            <Link to="/sessions" className="block w-full py-2 rounding-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold text-center transition-all shadow-lg shadow-red-500/20">
              {user.role === 'tutor' ? 'Go Live' : 'Browse Live'}
            </Link>
          </div>

          {/* Video Library Card */}
          <div className="bg-[#1a1d24]/60 border border-white/5 p-6 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-teal-500/30">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h4 className="text-xl font-bold mb-2 tracking-tight">Library</h4>
            <p className="text-gray-400 text-xs mb-4">Archives and session recordings.</p>
            <Link to="/videos" className="block w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold text-center transition-all shadow-lg shadow-teal-500/20">
              {user.role === 'tutor' ? 'Upload' : 'Watch Records'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
