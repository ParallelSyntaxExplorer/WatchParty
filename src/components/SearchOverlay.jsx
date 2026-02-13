import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchContent, TMDB_CONFIG } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchContent(query);
        setResults(data.filter(item => item.media_type !== 'person'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="search-overlay glass-morphism"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="search-header">
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon" size={24} />
          <input
            autoFocus
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={32} />
        </button>
      </div>

      <div className="search-results">
        {isLoading ? (
          <div className="search-loading">Searching...</div>
        ) : (
          <div className="results-grid">
            {results.map((item) => (
              <motion.div
                key={item.id}
                className="result-card"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                  navigate(`/watch/${type}/${item.id}`);
                  onClose();
                }}

              >
                <img
                  src={item.poster_path ? TMDB_CONFIG.getPoster(item.poster_path) : 'https://via.placeholder.com/200x300?text=No+Poster'}
                  alt={item.title || item.name}
                />
                <div className="result-info">
                  <h4>{item.title || item.name}</h4>
                  <span>{item.media_type?.toUpperCase()} • {new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3000;
          background: rgba(5,5,5,0.98);
          display: flex;
          flex-direction: column;
          padding: 40px 6%;
          backdrop-filter: blur(20px);
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 40px;
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 2px solid #333;
          padding: 10px 0;
        }

        .search-input-wrapper input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 2rem;
          width: 100%;
          outline: none;
        }

        .search-icon { color: #666; }

        .close-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          opacity: 0.6;
          transition: 0.3s;
        }

        .close-btn:hover { opacity: 1; transform: rotate(90deg); }

        .search-results {
          flex: 1;
          overflow-y: auto;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 25px;
          padding-bottom: 40px;
        }

        .result-card {
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          transition: 0.3s;
        }

        .result-card img {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
        }

        .result-info {
          padding: 12px;
        }

        .result-info h4 {
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-info span {
          font-size: 12px;
          color: #666;
        }

        .search-loading {
          text-align: center;
          font-size: 1.5rem;
          color: #666;
          margin-top: 100px;
        }
      `}</style>
    </motion.div>
  );
};

export default SearchOverlay;
