import React, { useRef } from 'react';
import { TMDB_CONFIG } from '../services/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieRow = ({ title, movies, onSelect, tabs = [], activeTab = '', onTabChange }) => {
  const rowRef = useRef(null);

  const slide = (direction) => {
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollTo = direction === 'left'
      ? scrollLeft - clientWidth * 0.8
      : scrollLeft + clientWidth * 0.8;

    rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  return (
    <div className="movie-row">
      <div className="row-header">
        <div className="row-title-container">
          <span className="title-bar" />
          <h2 className="row-title">{title}</h2>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="row-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`row-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row-container">
        <ChevronLeft className="row-arrow left" onClick={() => slide('left')} />

        <div className="row-scrollbox" ref={rowRef}>
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => onSelect(movie)}
            >
              <img
                className="card-poster"
                src={TMDB_CONFIG.getPoster(movie.poster_path)}
                alt={movie.title || movie.name}
              />

              {movie.lastSeason && (
                <div className="card-progress">
                  S{movie.lastSeason} E{movie.lastEpisode}
                </div>
              )}

              <div className="card-overlay">
                <span className="card-title">{movie.title || movie.name}</span>
                <span className="card-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <ChevronRight className="row-arrow right" onClick={() => slide('right')} />
      </div>

      <style>{`
        .movie-row {
          margin: clamp(20px, 5vw, 40px) 0;
          padding: 0 4%;
        }

        .row-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: clamp(10px, 3vw, 20px);
        }

        .row-title-container {
            display: flex;
            align-items: center;
            gap: clamp(8px, 2vw, 12px);
        }

        .title-bar {
            width: 3px;
            height: clamp(18px, 4vw, 24px);
            background: #e50914;
            border-radius: 2px;
        }

        .row-title {
          font-size: clamp(1.1rem, 4vw, 1.6rem);
          font-weight: 800;
          color: white;
          text-transform: capitalize;
        }

        .row-tabs {
            display: flex;
            gap: clamp(10px, 2vw, 15px);
            overflow-x: auto;
            padding-bottom: 5px;
        }
        .row-tabs::-webkit-scrollbar { display: none; }

        .row-tab {
            background: none;
            border: none;
            color: #666;
            font-size: clamp(0.75rem, 2vw, 0.85rem);
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
            padding-bottom: 2px;
            border-bottom: 2px solid transparent;
            white-space: nowrap;
        }

        .row-tab:hover { color: #aaa; }
        .row-tab.active {
            color: white;
            border-bottom-color: #e50914;
        }

        .row-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .row-scrollbox {
          display: flex;
          gap: clamp(10px, 2vw, 15px);
          overflow-x: scroll;
          scroll-behavior: smooth;
          padding: 10px 0;
          width: 100%;
        }

        .row-scrollbox::-webkit-scrollbar { display: none; }

        .movie-card {
          flex: 0 0 clamp(120px, 25vw, 170px);
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 2/3;
          background-color: #111;
          transition: transform 0.3s ease;
        }

        .card-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 15px 10px;
          background: linear-gradient(transparent, rgba(0,0,0,0.9));
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .movie-card:hover .card-overlay { opacity: 1; }
        .card-title { font-weight: 700; font-size: 0.85rem; }
        .card-rating { font-size: 0.75rem; color: #ffbc00; }

        .card-progress {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #e50914;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            z-index: 5;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .row-arrow {
          position: absolute;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: 0.3s;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .row-container:hover .row-arrow { opacity: 1; }
        .row-arrow.left { left: -20px; }
        .row-arrow.right { right: -20px; }

        @media (hover: none) {
            .row-arrow { display: none; }
            .card-overlay { opacity: 1; background: linear-gradient(transparent, rgba(0,0,0,0.6)); }
            .card-title { font-size: 0.75rem; }
        }

        @media (max-width: 480px) {
          .movie-card { flex: 0 0 110px; }
          .row-arrow.left { left: 0; }
          .row-arrow.right { right: 0; }
        }
      `}</style>
    </div>
  );
};

export default MovieRow;
