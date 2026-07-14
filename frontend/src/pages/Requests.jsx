import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/request', {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch requests');
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [navigate]);

  const handleUpdateStatus = async (requestId, status) => {
    setActionLoading(requestId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update request');

      // Update local state
      setRequests(prev => 
        prev.map(req => req._id === requestId ? { ...req, status } : req)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen text-white bg-[#0f1115] flex items-center justify-center text-xl font-medium animate-pulse">Loading requests...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-900/20 via-indigo-900/10 to-transparent rounded-full blur-[100px] mix-blend-screen pointer-events-none transform translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#1a1d24]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              Inbox
            </h1>
            <Link to="/dashboard" className="text-gray-400 font-bold hover:text-white transition-all flex items-center gap-2 group border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 sm:p-10 pt-16 relative z-10 w-full animate-fade-in-up">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Skill Requests🤝
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Manage incoming requests from users who want to learn from you. Accept them to start a collaboration!
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-[#1a1d24]/60 border border-white/5 p-12 rounded-[2rem] text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-800 flex items-center justify-center text-gray-500 mb-6 border border-gray-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
             </div>
            <h3 className="text-2xl font-bold mb-3">Your inbox is empty</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              When other users request to learn from you, they will appear here. Keep your profile updated to attract more matches!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-[#1a1d24]/60 border border-white/5 p-6 sm:p-8 rounded-[2rem] hover:bg-[#1a1d24]/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
                
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20 transform group-hover:-rotate-3 transition-transform">
                    {req.sender_id.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{req.sender_id.name}</h3>
                    <p className="text-gray-400 text-sm font-medium">
                      Wants to learn <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20 ml-1">{req.skill}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                        disabled={actionLoading === req._id}
                        className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                        disabled={actionLoading === req._id}
                        className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-gray-800 border border-gray-700 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-gray-300 font-bold transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm
                      ${req.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
