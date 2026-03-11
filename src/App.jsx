import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Filter, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [activePage, setActivePage] = useState('Games');
  const [hasStarted, setHasStarted] = useState(false);

  // Tab Cloaking Logic
  React.useEffect(() => {
    if (isStealthMode) {
      document.title = "Google Classroom";
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
      document.getElementsByTagName('head')[0].appendChild(link);
    } else {
      document.title = "gmath";
      const link = document.querySelector("link[rel*='icon']");
      if (link) link.href = 'https://ssl.gstatic.com/classroom/favicon.png'; // Use a reliable remote icon as default
    }
  }, [isStealthMode]);

  // Panic Key Logic (Press '`' to panic)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        window.location.href = 'https://classroom.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    const element = document.getElementById('game-container');
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes (e.g. user pressing Esc)
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Puzzle': 'neon-blue',
      'Arcade': 'neon-pink',
      'Action': 'neon-red',
      'IO': 'neon-yellow',
      'Sandbox': 'neon-green',
      'Strategy': 'neon-blue',
      'Horror': 'neon-red',
      'Sports': 'neon-green',
      'Simulation': 'neon-yellow',
      'Movies': 'neon-blue',
      'Social': 'neon-pink',
      'Apps': 'neon-yellow',
      'All': 'neon-green'
    };
    return colors[category] || 'neon-green';
  };

  const getCategoryBg = (category) => {
    const bgs = {
      'Puzzle': 'bg-neon-blue',
      'Arcade': 'bg-neon-pink',
      'Action': 'bg-neon-red',
      'IO': 'bg-neon-yellow',
      'Sandbox': 'bg-neon-green',
      'Strategy': 'bg-neon-blue',
      'Horror': 'bg-neon-red',
      'Sports': 'bg-neon-green',
      'Simulation': 'bg-neon-yellow',
      'Movies': 'bg-neon-blue',
      'Social': 'bg-neon-pink',
      'Apps': 'bg-neon-yellow',
      'All': 'bg-neon-green'
    };
    return bgs[category] || 'bg-neon-green';
  };

  const pages = ['Games', 'Movies', 'Social', 'Apps'];

  const getPageContent = (page) => {
    if (page === 'Games') {
      return gamesData.filter(g => !['Movies', 'Social', 'Apps'].includes(g.category));
    }
    return gamesData.filter(g => g.category === page);
  };

  const currentPageData = useMemo(() => getPageContent(activePage), [activePage]);

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(currentPageData.map(g => g.category)))];
    return cats;
  }, [currentPageData]);

  const filteredGames = useMemo(() => {
    const games = currentPageData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Deduplicate by ID to prevent React key warnings
    const seen = new Set();
    return games.filter(game => {
      if (seen.has(game.id)) return false;
      seen.add(game.id);
      return true;
    });
  }, [searchQuery, selectedCategory, currentPageData]);

  // Reset category when page changes
  React.useEffect(() => {
    setSelectedCategory('All');
  }, [activePage]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-12">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-600/10 p-6 brutal-border inline-block mb-4 rounded-2xl"
              >
                <Info className="text-blue-500 w-16 h-16" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white">
                  G<span className="text-blue-600">MATH</span>
                </h1>
                <p className="font-mono text-xs text-white/40 uppercase tracking-[0.3em]">
                  Advanced Computational Learning Environment
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-8 brutal-border bg-slate-900/50 text-left space-y-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 text-blue-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">System Status: Ready</span>
                </div>
                <p className="text-sm font-mono text-slate-300 leading-relaxed">
                  Accessing the GMATH secure portal. This environment provides high-performance computing resources, interactive mathematical models, and curriculum-aligned digital assets.
                </p>
                <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    Encrypted Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    v2.5.0_STABLE
                  </p>
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setHasStarted(true)}
                className="w-full bg-blue-600 text-white brutal-border p-6 font-black uppercase tracking-[0.2em] text-lg rounded-2xl transition-all shadow-lg shadow-blue-900/20"
              >
                Initialize Portal
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Sticky Header & Nav Container */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        {/* Header */}
        <header className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className={`${isStealthMode ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'} p-3 brutal-border rounded-xl transition-colors`}>
              {isStealthMode ? <Info className="w-6 h-6" /> : <Gamepad2 className="w-6 h-6" />}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              {isStealthMode ? (
                <>G<span className="text-blue-600">MATH</span></>
              ) : (
                <>G<span className="text-blue-500">MATH</span></>
              )}
            </h1>
          </div>

          <div className="flex flex-1 max-w-3xl w-full gap-4">
            <button
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`brutal-border px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl ${
                isStealthMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {isStealthMode ? 'Stealth: Active' : 'Stealth: Disabled'}
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder={isStealthMode ? "QUERY DATASET..." : "SEARCH CONTENT..."}
                className="w-full bg-slate-900/50 brutal-border p-4 pl-14 focus:outline-none focus:border-blue-500 transition-all uppercase font-mono text-xs rounded-xl tracking-wider"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="brutal-border p-4 hover:bg-slate-800 transition-colors rounded-xl"
            >
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Navigation */}
        <nav className="bg-slate-900/30 border-t border-slate-800">
          <div className="flex items-center justify-center px-8">
            {pages.map(page => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`px-8 py-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all relative ${
                  activePage === page ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isStealthMode ? `Section: ${page.charAt(0)}` : page}
                {activePage === page && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed md:sticky top-[180px] left-0 h-[calc(100vh-180px)] w-72 bg-slate-950 border-r border-slate-800 z-30 p-8 flex flex-col gap-10"
            >
              <div>
                <h3 className="text-[10px] font-mono uppercase text-slate-500 mb-6 tracking-[0.2em]">Categories</h3>
                <div className="flex flex-col gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                        selectedCategory === cat 
                          ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider">{cat}</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${selectedCategory === cat ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                {isStealthMode && (
                  <div className="brutal-border p-5 bg-blue-600/5 border-blue-500/20 rounded-2xl">
                    <h4 className="text-[9px] font-mono uppercase text-blue-500 mb-3 tracking-widest font-bold">Teacher Resources</h4>
                    <ul className="text-[9px] font-mono text-slate-500 flex flex-col gap-2">
                      <li className="flex items-center gap-2 hover:text-slate-300 cursor-pointer transition-colors">• Lesson Plan PDF</li>
                      <li className="flex items-center gap-2 hover:text-slate-300 cursor-pointer transition-colors">• Curriculum Map</li>
                      <li className="flex items-center gap-2 hover:text-slate-300 cursor-pointer transition-colors">• Assessment Tools</li>
                    </ul>
                  </div>
                )}
                <div className="brutal-border p-5 bg-slate-900/50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] font-mono uppercase text-slate-400 tracking-widest">System Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Operational</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative bg-[#111] brutal-border brutal-shadow flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1`}
                style={{ 
                  boxShadow: `4px 4px 0px 0px ${
                    getCategoryColor(game.category) === 'neon-blue' ? '#00FFFF' :
                    getCategoryColor(game.category) === 'neon-pink' ? '#FF00FF' :
                    getCategoryColor(game.category) === 'neon-red' ? '#FF0000' :
                    getCategoryColor(game.category) === 'neon-yellow' ? '#FFFF00' :
                    '#00FF00'
                  }`
                }}
              >
                <div className="aspect-video overflow-hidden border-b-2 border-white relative">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/seed/math/400/300?blur=2';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/80 brutal-border px-2 py-1 text-[10px] font-mono uppercase">
                    {game.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className={`text-2xl font-black uppercase mb-2 transition-colors ${getCategoryColor(game.category)}`}>
                    {isStealthMode ? `Module: ${game.category}` : game.title}
                  </h2>
                  <p className="text-sm text-white/60 font-mono mb-6 line-clamp-2">
                    {isStealthMode ? "Interactive curriculum-aligned educational resource for skill-building." : game.description}
                  </p>
                  
                  <button
                    onClick={() => setActiveGame(game)}
                    className={`mt-auto w-full bg-white text-black font-black uppercase p-4 brutal-border hover:text-white transition-colors flex items-center justify-center gap-2 ${
                      getCategoryBg(game.category).replace('bg-', 'hover:bg-')
                    }`}
                  >
                    {isStealthMode ? 'OPEN RESOURCE' : 'LAUNCH'} <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="brutal-border p-8 bg-white/5 max-w-md">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase mb-2">No Games Found</h3>
                <p className="text-white/50 font-mono">
                  Your search for "{searchQuery}" returned no results. Try another query or category.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono uppercase text-slate-500 tracking-widest">
        <div>© 2026 GMATH // COMPUTATIONAL LEARNING SYSTEMS</div>
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <span className="bg-slate-900 px-2 py-1 brutal-border rounded">`</span> PANIC KEY
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-slate-900 px-2 py-1 brutal-border rounded">STEALTH</span> CLOAKING
          </span>
        </div>
        <div className="text-blue-500 font-bold">BUILD_V2.6.0_GMATH_STABLE</div>
      </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Viewer Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            <div className={`border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/90 backdrop-blur-xl transition-all ${isFullscreen ? 'h-0 p-0 overflow-hidden border-none' : ''}`}>
              <div className="flex items-center gap-6">
                <div className={`${isStealthMode ? 'bg-blue-600/10 text-blue-500' : 'bg-green-600/10 text-green-500'} p-2 brutal-border rounded-lg transition-colors`}>
                  {isStealthMode ? <Info className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    {isStealthMode ? `Module: ${activeGame.id.toUpperCase()}` : activeGame.title}
                  </h2>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Resource Path: /bin/exec/{activeGame.id}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400 hover:text-blue-500 transition-colors brutal-border px-4 py-2 rounded-lg tracking-widest"
                >
                  {isFullscreen ? 'Exit Full' : 'Fullscreen'} <Maximize2 className="w-3 h-3" />
                </button>
                <a 
                  href={activeGame.iframeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400 hover:text-blue-500 transition-colors tracking-widest"
                >
                  External Link <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActiveGame(null)}
                  className="brutal-border p-2 hover:bg-red-500/10 hover:text-red-500 transition-colors rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div id="game-container" className="flex-1 bg-slate-950 relative flex flex-col">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none opacity-10">
                <div className="brutal-border p-8 bg-slate-900 max-w-sm rounded-3xl">
                  <Info className="w-10 h-10 mx-auto mb-6 text-blue-500" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                    Initializing secure sandbox environment. If content fails to render, verify network connectivity or use the external link provided above.
                  </p>
                </div>
              </div>
              <iframe
                src={activeGame.iframeUrl}
                className="w-full h-full border-none relative z-10"
                title={activeGame.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-6 right-6 z-50 bg-slate-950/50 backdrop-blur-md brutal-border p-3 text-white hover:bg-white hover:text-black transition-all opacity-0 hover:opacity-100 rounded-xl"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
