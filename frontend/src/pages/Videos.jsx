import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ title: '', video_link: '' });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoData = async () => {
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
        setUser(profileData);

        const res = await fetch('http://localhost:5000/api/videos', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch videos');
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [navigate]);

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to upload video');

      setVideos([data, ...videos]);
      setFormData({ title: '', video_link: '' });
      alert('Video record added successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">Retrieving archives...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-900/10 via-emerald-900/5 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              Learning Library
            </h1>
            <Link to="/dashboard" className="text-gray-400 font-bold hover:text-white transition-all flex items-center gap-2 group border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10 pt-16 relative z-10 w-full animate-fade-in-up">
        
        {/* Tutor Section: Upload Video */}
        {user?.role === 'tutor' && (
          <div className="mb-20">
            <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Archive a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Class Recording</span> 📚</h2>
            <form onSubmit={handleUploadVideo} className="bg-[#1a1d24]/60 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-end gap-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
              <div className="flex-1 w-full space-y-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Video Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Master React Hooks Part 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all font-medium"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">YouTube/Video URL</label>
                <input 
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_link}
                  onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium"
                />
              </div>
              <button 
                disabled={uploading}
                className="w-full md:w-auto py-4 px-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl font-bold text-white shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {uploading ? 'Archiving...' : 'Add to Library'}
              </button>
            </form>
          </div>
        )}

        {/* Global Section: Recorded Classes */}
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">On-Demand Learning 📺</h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mb-10">
            Missed a live session? Watch any of our past recorded workshops to stay up to speed with your learning.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="bg-[#1a1d24]/40 border border-dashed border-white/10 p-16 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-inner">
             <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-800/40 flex items-center justify-center text-gray-600 mb-6 border border-white/5">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
              </div>
             <h3 className="text-2xl font-bold mb-3">The library is currently being curated</h3>
             <p className="text-gray-400 font-medium">Recorded classes will appear here as mentors upload them. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video._id} className="bg-[#1a1d24]/60 border border-white/5 p-8 rounded-[2.5rem] hover:bg-[#1a1d24]/80 transition-all duration-500 group relative overflow-hidden flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-teal-400 transition-colors line-clamp-2">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-gray-400 text-sm font-semibold italic">Recorded by {video.tutor_id?.name}</span>
                  </div>
                </div>

                <a 
                  href={video.video_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 group/btn mt-auto shadow-xl shadow-black/20"
                >
                  Watch Lesson
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
