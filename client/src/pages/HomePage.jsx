import React, { useEffect, useState } from 'react';
import PollCard from '../components/PollCard';
import { Loader2, TriangleAlert, Vote } from 'lucide-react';

function HomePage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch('/api/polls');
        if (!res.ok) throw new Error('Failed to fetch polls');
        const data = await res.json();
        setPolls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
        <p className="text-sm text-zinc-400">Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <TriangleAlert className="w-8 h-8 text-red-400" />
        <p className="text-sm text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Real-time <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">polls</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-base sm:text-lg">
          Vote on live polls and watch results update instantly
        </p>
      </div>

      {polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Vote className="w-6 h-6 text-zinc-500" />
          </div>
          <h2 className="text-lg font-semibold text-white">No polls yet</h2>
          <p className="text-sm text-zinc-500 mt-1">Be the first to create a poll!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;