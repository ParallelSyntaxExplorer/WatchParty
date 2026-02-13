import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TMDB_CONFIG } from '../services/tmdb';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = ({ movies, onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  return (
    <div className="hero">
      <AnimatePresence initial={false}>
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="hero-slide"
        >
          <div className="hero-backdrop">
            {movie.backdrop_path ? (
              <img
                src={TMDB_CONFIG.getBackdrop(movie.backdrop_path)}
                alt={movie.title || movie.name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="backdrop-placeholder" />
            )}
            <div className="hero-overlay" />
          </div>

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">{movie.title || movie.name}</h1>

            <div className="hero-meta">
              <span className="hero-rating"><Star size={14} fill="#e50914" color="#e50914" /> {(movie.vote_average || 0).toFixed(1)}</span>
              <span className="hero-year"><Calendar size={14} /> {new Date(movie.release_date || movie.first_air_date).getFullYear()}</span>
              <span className="hero-badge">HD</span>
            </div>

            <p className="hero-overview">
              {movie.overview?.length > 150
                ? movie.overview.substring(0, 150) + "..."
                : movie.overview}
            </p>

            <div className="hero-buttons">
              <button className="btn-play" onClick={() => onPlay(movie)}>
                <Play fill="currentColor" size={20} /> Play
              </button>

              <button className="btn-info">
                <Info size={20} /> See More
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-indicators">
        {movies.slice(0, 10).map((_, idx) => (
          <div
            key={idx}
            className={`indicator ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      <style>{`
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .hero-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .hero-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hero-backdrop img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(70deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 100%),
                      linear-gradient(to top, var(--bg-color) 0%, transparent 30%);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          padding: 0 6%;
          margin-top: 50px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          margin-bottom: 20px;
          line-height: 1;
          color: white;
          text-shadow: 2px 2px 20px rgba(0,0,0,0.8);
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
          font-weight: 600;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: rgba(255,255,255,0.8);
        }

        .rating { color: #ffbc00; display: flex; align-items: center; gap: 6px; }
        .quality-badge { 
            background: rgba(255,255,255,0.2); 
            padding: 2px 8px; 
            border-radius: 4px; 
            font-size: 0.7rem; 
            border: 1px solid rgba(255,255,255,0.3);
        }

        .hero-overview {
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          margin-bottom: 35px;
          color: #ccc;
          line-height: 1.6;
          max-width: 600px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .btn-play, .btn-info {
            padding: clamp(10px, 2vw, 12px) clamp(20px, 4vw, 35px);
            border-radius: 8px;
            font-weight: 800;
            font-size: clamp(0.9rem, 2vw, 1rem);
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
        }

        .btn-play { background: white; color: black; }
        .btn-play:hover { background: #e1e1e1; transform: scale(1.05); }

        .btn-info {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-info:hover { background: rgba(255,255,255,0.25); transform: scale(1.05); }

        .hero-indicators {
            position: absolute;
            bottom: clamp(30px, 8vh, 60px);
            right: 6%;
            display: flex;
            gap: 10px;
            z-index: 20;
        }

        .indicator {
            width: clamp(20px, 5vw, 30px);
            height: 3px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            cursor: pointer;
            transition: 0.3s;
        }

        .indicator.active {
            background: #e50914;
            width: clamp(30px, 8vw, 45px);
        }

        @media (max-width: 1024px) {
            .hero-content { max-width: 80%; }
        }

        @media (max-width: 768px) {
          .hero-overlay {
              background: linear-gradient(to top, var(--bg-color) 10%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%);
          }
          .hero-content { 
              padding-top: 100px;
              max-width: 100%;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
          }
          .hero-buttons { justify-content: center; width: 100%; }
          .hero-overview { max-width: 90%; }
          .hero-indicators { 
              right: 50%;
              transform: translateX(50%);
              bottom: 30px;
          }
        }

        @media (max-width: 480px) {
            .hero-meta { gap: 10px; font-size: 0.8rem; }
            .hero-buttons { flex-direction: column; }
            .btn-play, .btn-info { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
