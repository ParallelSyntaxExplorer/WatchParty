import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import SearchOverlay from './components/SearchOverlay';
import AuthOverlay from './components/AuthOverlay';
import UserAccount from './components/UserAccount';
import ChangePasswordModal from './components/ChangePasswordModal';
import { AnimatePresence } from 'framer-motion';
import { supabase, authActions, dataActions } from './services/supabase';
import './styles/globals.css';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchparty_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('watchparty_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Handle Supabase Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync Data on Login
  useEffect(() => {
    const syncOnLogin = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      // Fetch Profile
      const { data: prof } = await dataActions.fetchProfile(user.id);
      if (prof) setProfile(prof);

      // Fetch Remote Data & Merge
      const { data: remoteData } = await dataActions.fetchUserData(user.id);
      if (remoteData) {
        // Merge Watchlist
        if (remoteData.watchlist) {
          setWatchlist(prev => {
            const localIds = new Set(prev.map(m => m.id));
            const merged = [...prev];
            remoteData.watchlist.forEach(m => {
              if (!localIds.has(m.id)) merged.push(m);
            });
            return merged;
          });
        }
        // Merge History
        if (remoteData.history) {
          setHistory(prev => {
            const localIds = new Set(prev.map(m => m.id));
            const merged = [...prev];
            remoteData.history.forEach(m => {
              if (!localIds.has(m.id)) merged.push(m);
            });
            return merged;
          });
        }
      }
    };

    syncOnLogin();
  }, [user]);

  // Save to DB when data changes
  useEffect(() => {
    localStorage.setItem('watchparty_watchlist', JSON.stringify(watchlist));
    localStorage.setItem('watchparty_history', JSON.stringify(history));

    const saveToDB = async () => {
      if (user) {
        await dataActions.updateUserData(user.id, { watchlist, history });
      }
    };

    const timeout = setTimeout(saveToDB, 3000); // 3s debounce
    return () => clearTimeout(timeout);
  }, [watchlist, history, user]);

  const toggleWatchlist = (movie) => {
    setWatchlist(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const updateHistory = (movie, metadata = {}) => {
    setHistory(prev => {
      // Find existing record for this ID
      const existingIndex = prev.findIndex(m => m.id === movie.id);

      const newRecord = {
        ...movie,
        lastSeason: metadata.season || 1,
        lastEpisode: metadata.episode || 1,
        lastUpdated: new Date().getTime()
      };

      let updatedHistory;
      if (existingIndex !== -1) {
        // Remove old, put new at top
        updatedHistory = [newRecord, ...prev.filter(m => m.id !== movie.id)];
      } else {
        updatedHistory = [newRecord, ...prev];
      }

      return updatedHistory.slice(0, 50);
    });
  };

  const handleLogout = async () => {
    await authActions.signOut();
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          onSearchOpen={() => setIsSearchOpen(true)}
          onProfileClick={handleProfileClick}
          user={user}
        />

        <Routes>
          <Route path="/" element={<Home watchlist={watchlist} history={history} />} />
          <Route
            path="/watch/:type/:id"
            element={
              <Watch
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onWatch={updateHistory}
                history={history}
              />
            }
          />
        </Routes>

        <footer className="app-footer" style={{ padding: '60px', textAlign: 'center', opacity: 0.8, fontSize: '0.9rem', fontWeight: '700', letterSpacing: '2px', color: '#666' }}>
          <p>MADE BY AAQIB</p>
        </footer>

        <AnimatePresence>
          {isSearchOpen && (
            <SearchOverlay
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          )}

          {isAuthOpen && (
            <AuthOverlay
              isOpen={isAuthOpen}
              onClose={() => setIsAuthOpen(false)}
              onAuthSuccess={() => setIsAuthOpen(false)}
            />
          )}

          {isProfileOpen && (
            <UserAccount
              user={user}
              profile={profile}
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              onLogout={handleLogout}
              onChangePassword={() => {
                setIsProfileOpen(false);
                setIsPasswordModalOpen(true);
              }}
            />
          )}

          {isPasswordModalOpen && (
            <ChangePasswordModal
              isOpen={isPasswordModalOpen}
              onClose={() => setIsPasswordModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
