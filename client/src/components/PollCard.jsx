import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

function PollCard({ poll }) {
  const navigate = useNavigate();
  const topOption =
    poll.options && poll.options.length > 0
      ? poll.options.reduce((max, opt) => (opt.votes > max.votes ? opt : max), poll.options[0])
      : null;
  const createdDate = new Date(poll.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => navigate(`/poll/${poll._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/poll/${poll._id}`)}
      aria-label={`View poll: ${poll.question}`}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-violet-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          LIVE
        </span>
        <span className="text-xs text-zinc-500">{createdDate}</span>
      </div>

      <h3 className="text-base font-semibold text-white leading-snug mb-6 pr-6">
        {poll.question}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">{poll.totalVotes}</span>
            <span className="text-xs text-zinc-500">votes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">{poll.options.length}</span>
            <span className="text-xs text-zinc-500">options</span>
          </div>
        </div>

        {topOption && poll.totalVotes > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 max-w-[45%] truncate">
            <Trophy size={13} className="text-amber-400 shrink-0" />
            <span className="truncate">{topOption.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollCard;