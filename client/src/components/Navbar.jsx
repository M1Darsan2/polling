import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-2 font-[Space_Grotesk] text-lg font-bold text-white tracking-tight">
          <Zap size={20} className="text-violet-400" fill="currentColor" />
          Polling
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'text-white bg-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 ${
              location.pathname === '/create' ? 'ring-2 ring-violet-400' : ''
            }`}
          >
            + Create poll
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="sm:hidden text-zinc-300"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 border-t border-zinc-800 pt-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'text-white bg-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/create"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
          >
            + Create poll
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;