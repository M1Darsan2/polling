import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, TriangleAlert, Loader2, Rocket } from 'lucide-react';

function CreatePage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedQuestion = question.trim();
    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);

    if (!trimmedQuestion) {
      setError('Please enter a question.');
      return;
    }
    if (validOptions.length < 2) {
      setError('Please provide at least 2 non-empty options.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedQuestion, options: validOptions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create poll');
      }

      const newPoll = await res.json();
      navigate(`/poll/${newPoll._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Create a new poll
        </h1>
        <p className="text-sm text-zinc-500 mt-2">Ask a question and let the crowd decide</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-zinc-300 mb-2">
            Your question
          </label>
          <input
            id="question"
            type="text"
            placeholder="e.g. What's the best programming language?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={200}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
          <span className="text-xs text-zinc-600 mt-1 block text-right">{question.length}/200</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Options</label>
          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 text-sm text-zinc-500 text-center shrink-0">{index + 1}</span>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  maxLength={100}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    aria-label={`Remove option ${index + 1}`}
                    className="shrink-0 text-zinc-500 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length <10 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus size={15} />
              Add option
              <span className="text-zinc-600">({options.length}/10)</span>
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            <TriangleAlert size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          id="create-poll-submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating poll...
            </>
          ) : (
            <>
              <Rocket size={16} />
              Launch poll
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreatePage;