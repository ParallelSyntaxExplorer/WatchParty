import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetails, fetchSeasonDetails, TMDB_CONFIG } from '../services/tmdb';
import { Play, Plus, Check, Star, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';

const Watch = ({ toggleWatchlist, watchlist, onWatch, history = [] }) => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);

  // Find saved progress
  const savedProgress = history.find(m => m.id === parseInt(id) || m.id === id);

  const [season, setSeason] = useState(savedProgress?.lastSeason || 1);
  const [episode, setEpisode] = useState(savedProgress?.lastEpisode || 1);

  // Sync state when savedProgress changes (e.g. navigation)
  useEffect(() => {
    if (savedProgress) {
      setSeason(savedProgress.lastSeason || 1);
      setEpisode(savedProgress.lastEpisode || 1);
    } else {
      setSeason(1);
      setEpisode(1);
    }
  }, [id, savedProgress?.lastSeason, savedProgress?.lastEpisode]);

  // Update history when Season or Episode changes
  useEffect(() => {
    if (content) {
      onWatch(content, { season, episode });
    }
  }, [season, episode, content]);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDetails(id, type);
        setContent(data);

        // If it's a new item, trigger initial watch
        if (!savedProgress) {
          onWatch(data, { season: 1, episode: 1 });
        }

        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id, type]);

  useEffect(() => {
    if (type === 'tv' && content) {
      const loadSeason = async () => {
        setIsLoadingSeason(true);
        try {
          const data = await fetchSeasonDetails(id, season);
          setSeasonDetails(data);
        } catch (error) {
          console.error("Error fetching season:", error);
        } finally {
          setIsLoadingSeason(false);
        }
      };
      loadSeason();
    }
  }, [id, type, season, content]);

  if (isLoading || !content) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-color);
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const isInWatchlist = watchlist.some(m => m.id === content.id);
  const [source, setSource] = useState('vidsrc.xyz');

  const sources = [
    { id: 'vidsrc.xyz', name: 'Server 1 (HD)', url: (t, i, s, e) => t === 'tv' ? `https://vidsrc.xyz/embed/tv?tmdb=${i}&season=${s}&episode=${e}` : `https://vidsrc.xyz/embed/movie?tmdb=${i}` },
    { id: 'vidsrc.me', name: 'Server 2 (Fast)', url: (t, i, s, e) => t === 'tv' ? `https://vidsrc.me/embed/tv?tmdb=${i}&season=${s}&episode=${e}` : `https://vidsrc.me/embed/movie?tmdb=${i}` },
    { id: 'vidsrc.to', name: 'Server 3 (Stable)', url: (t, i, s, e) => t === 'tv' ? `https://vidsrc.to/embed/tv/${i}/${s}/${e}` : `https://vidsrc.to/embed/movie/${i}` },
  ];

  const currentSource = sources.find(s => s.id === source);
  const embedUrl = currentSource.url(type, id, season, episode);

  const handleEpisodeClick = (epNum) => {
    setEpisode(epNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="watch-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="player-section" style={{ position: 'relative' }}>
        {/* Source Selector Overlay */}
        <div className="source-selector">
          {sources.map(src => (
            <button
              key={src.id}
              className={`source-btn ${source === src.id ? 'active' : ''}`}
              onClick={() => setSource(src.id)}
            >
              {src.name}
            </button>
          ))}
        </div>

        <iframe
          src={embedUrl}
          key={`${source}-${id}-${season}-${episode}`}
          title="WatchParty Player"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          className="watch-iframe"
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-modals"
        />
      </div>

      <div className="content-info-section">
        <div className="info-container">
          <div className="main-info">
            <h1 className="content-title">{content.title || content.name}</h1>

            <div className="meta-row">
              <span className="rating"><Star size={16} fill="#ffbc00" color="#ffbc00" /> {content.vote_average?.toFixed(1)}</span>
              <span className="year"><Calendar size={16} /> {new Date(content.release_date || content.first_air_date).getFullYear()}</span>
              {content.runtime && <span className="duration"><Clock size={16} /> {content.runtime} min</span>}
              <span className="quality-badge">HD</span>
            </div>

            <div className="actions-row">
              <button className="btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Play fill="currentColor" size={20} /> Resume
              </button>
              <button className="btn-secondary" onClick={() => toggleWatchlist(content)}>
                {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            <p className="overview">{content.overview}</p>

            <div className="extra-details">
              {content.genres && (
                <div className="detail-item">
                  <span className="label">Genres:</span>
                  <span className="value">{content.genres.map(g => g.name).join(', ')}</span>
                </div>
              )}
              {content.credits?.cast && (
                <div className="detail-item">
                  <span className="label">Cast:</span>
                  <span className="value">{content.credits.cast.slice(0, 5).map(c => c.name).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {type === 'tv' && (
            <div className="side-panel">
              <div className="tv-controls-header">
                <h3>Episodes</h3>
                <select
                  className="season-select"
                  value={season}
                  onChange={(e) => {
                    setSeason(parseInt(e.target.value));
                    setEpisode(1);
                  }}
                >
                  {[...Array(content.number_of_seasons || 1)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="episodes-list">
                {isLoadingSeason ? (
                  <div className="season-loading">Loading episodes...</div>
                ) : (
                  seasonDetails?.episodes?.map((ep) => (
                    <div
                      key={ep.id}
                      className={`episode-card ${episode === ep.episode_number ? 'active' : ''}`}
                      onClick={() => handleEpisodeClick(ep.episode_number)}
                    >
                      <div className="episode-thumbnail">
                        <img
                          src={ep.still_path ? TMDB_CONFIG.getBackdrop(ep.still_path, 'w300') : 'https://via.placeholder.com/150x85?text=No+Preview'}
                          alt={ep.name}
                        />
                        {episode === ep.episode_number && <div className="now-playing-badge">Now Playing</div>}
                      </div>
                      <div className="episode-info">
                        <div className="ep-top">
                          <span className="ep-num">E{ep.episode_number}</span>
                          <span className="ep-name">{ep.name}</span>
                        </div>
                        <p className="ep-overview">{ep.overview || "No description available."}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {content.recommendations?.results?.length > 0 && (
          <div className="recommendations">
            <MovieRow
              title="Recommended for You"
              movies={content.recommendations.results}
              onSelect={(m) => navigate(`/watch/${m.media_type || type}/${m.id}`)}
            />
          </div>
        )}
      </div>

      <style>{`
        .watch-page {
          padding-top: clamp(60px, 10vh, 80px);
          min-height: 100vh;
        }

        .player-section {
          width: 100%;
          aspect-ratio: 21/9;
          background: #000;
          box-shadow: 0 10px 50px rgba(0,0,0,0.8);
        }

        @media (max-width: 1024px) {
          .player-section { aspect-ratio: 16/9; }
        }

        .watch-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .source-selector {
            position: absolute;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 100;
        }

        .source-btn {
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            color: #aaa;
            padding: 8px 15px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
        }

        .source-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .source-btn.active {
            background: #e50914;
            color: white;
            border-color: #e50914;
            box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
        }

        @media (max-width: 600px) {
            .source-selector { bottom: 10px; left: 10px; gap: 5px; }
            .source-btn { padding: 6px 10px; font-size: 0.7rem; }
        }

        .content-info-section {
          padding: clamp(20px, 5vw, 40px) 6%;
        }

        .info-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: clamp(30px, 5vw, 60px);
          margin-bottom: 60px;
        }

        .main-info h1 {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 15px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          font-weight: 600;
          color: #888;
          font-size: 0.9rem;
        }

        .rating { color: #ffbc00; }

        .watch-actions {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(10px, 2vw, 15px);
          margin-bottom: 30px;
        }

        .btn-play, .btn-secondary {
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: 0.3s;
            border: none;
            font-size: 0.9rem;
        }

        .btn-play { background: #e50914; color: white; }
        .btn-play:hover { background: #ff0f1a; transform: translateY(-2px); }

        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: white;
            backdrop-filter: blur(10px);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.2); }

        .overview {
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          line-height: 1.6;
          color: #ccc;
          margin-bottom: 30px;
          max-width: 800px;
        }

        .extra-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          font-size: 0.9rem;
          display: flex;
          gap: 8px;
        }

        .label { color: #666; font-weight: 600; }
        .value { color: #aaa; }

        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 800px;
        }

        .tv-controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .tv-controls-header h3 { font-size: 1.2rem; }

        .season-select {
          background: #1a1a1a;
          border: 1px solid #333;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          outline: none;
          font-size: 14px;
          cursor: pointer;
        }

        .episodes-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 5px;
        }

        .episodes-list::-webkit-scrollbar { width: 4px; }
        .episodes-list::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

        .episode-card {
          display: flex;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.3s;
          background: rgba(255,255,255,0.02);
          border: 1px solid transparent;
        }

        .episode-card:hover {
          background: rgba(255,255,255,0.06);
        }

        .episode-card.active {
          background: rgba(229, 9, 20, 0.1);
          border-color: #e50914;
        }

        .episode-thumbnail {
          position: relative;
          width: clamp(100px, 25vw, 150px);
          aspect-ratio: 16/9;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
        }

        .episode-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .now-playing-badge {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
          color: #e50914;
          text-transform: uppercase;
        }

        .episode-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
          justify-content: center;
        }

        .ep-top {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ep-num {
          font-size: 11px;
          color: #e50914;
          font-weight: 800;
        }

        .ep-name {
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ep-overview {
          font-size: 11px;
          color: #666;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 1200px) {
          .info-container { grid-template-columns: 1fr; gap: 40px; }
          .side-panel { max-height: none; }
        }

        @media (max-width: 480px) {
            .content-info-section { padding: 25px 4%; }
            .btn-play, .btn-secondary { width: 100%; justify-content: center; }
            .episode-card { flex-direction: column; gap: 10px; }
            .episode-thumbnail { width: 100%; }
            .ep-name { white-space: normal; }
        }

      `}</style>
    </motion.div>
  );
};

export default Watch;
