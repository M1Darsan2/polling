import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import { ArrowLeft, TriangleAlert, Loader2, Check, Trophy, Link2 } from 'lucide-react';

function PollPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voted, setVoted] = useState(false);
  const [votedIndex, setVotedIndex] = useState(null);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedVote = localStorage.getItem(`livepoll_voted_${id}`);
    if (storedVote !== null) {
      setVoted(true);
      setVotedIndex(parseInt(storedVote, 10));
    }
  }, [id]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch(`/api/polls/${id}`);
        if (!res.ok) throw new Error('Poll not found');
        const data = await res.json();
        setPoll(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  useEffect(() => {
    socket.emit('joinPoll', id);

    socket.on('pollUpdated', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off('pollUpdated');
    };
  }, [id]);

  const handleVote = async (optionIndex) => {
    if (voted || voting) return;

    setVoting(true);
    try {
      socket.emit('submitVote', { pollId: id, optionIndex });
      localStorage.setItem(`livepoll_voted_${id}`, optionIndex);
      setVoted(true);
      setVotedIndex(optionIndex);
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVoting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const getPercentage = (votes) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
        <p className="text-sm text-zinc-400">Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <TriangleAlert className="w-8 h-8 text-red-400" />
        <p className="text-sm text-zinc-400">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>
      </div>
    );
  }

  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-full px-3 py-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Link2 size={13} />
                Copy link
              </>
            )}
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {poll.question}
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'} cast
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {poll.options.map((option, index) => {
          const pct = getPercentage(option.votes);
          const isVotedOption = voted && votedIndex === index;
          const isWinning = voted && poll.totalVotes > 0 && option.votes === maxVotes;

          return (
            <div
              key={index}
              onClick={() => handleVote(index)}
              role={!voted ? 'button' : undefined}
              tabIndex={!voted ? 0 : undefined}
              onKeyDown={(e) => !voted && e.key === 'Enter' && handleVote(index)}
              aria-label={`Vote for ${option.text}`}
              className={`relative overflow-hidden rounded-xl border p-4 transition-colors ${
                voted
                  ? isWinning
                    ? 'border-violet-500/50 bg-violet-500/5'
                    : 'border-zinc-800 bg-zinc-900'
                  : 'border-zinc-800 bg-zinc-900 cursor-pointer hover:border-violet-500/50'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white flex items-center gap-1.5">
                  {isVotedOption && <Check size={14} className="text-violet-400" />}
                  {option.text}
                </span>
                {voted && (
                  <span className="text-sm font-semibold text-zinc-300">{pct}%</span>
                )}
              </div>

              {voted && (
                <div className="relative z-10 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinning ? 'bg-violet-500' : 'bg-zinc-600'
                    }`}
                    style={{ width: `${pct}%` }}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              )}

              {voted && (
                <span className="relative z-10 text-xs text-zinc-500 mt-2 flex items-center gap-1">
                  {isWinning && <Trophy size={12} className="text-amber-400" />}
                  {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!voted && (
        <p className="text-center text-sm text-zinc-500 mt-6">Click an option to cast your vote</p>
      )}
      {voted && (
        <p className="text-center text-sm text-zinc-500 mt-6">Your vote has been recorded. Results update live.</p>
      )}
    </div>
  );
}

export default PollPage;