import React, { useRef } from 'react';
import { TMDB_CONFIG } from '../services/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Top10Row = ({ title, movies, onSelect }) => {
    const rowRef = useRef(null);

    const slide = (direction) => {
        const { scrollLeft, clientWidth } = rowRef.current;
        const scrollTo = direction === 'left'
            ? scrollLeft - clientWidth * 0.8
            : scrollLeft + clientWidth * 0.8;

        rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    };

    return (
        <div className="top10-row">
            <h2 className="row-title">
                <span className="title-bar" />
                {title}
                <span className="title-suffix">CONTENT TODAY</span>
            </h2>

            <div className="row-container">
                <ChevronLeft className="row-arrow left" onClick={() => slide('left')} />

                <div className="row-scrollbox" ref={rowRef}>
                    {movies.slice(0, 10).map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            className="top10-card"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onSelect(movie)}
                        >
                            <span className="rank-number">{index + 1}</span>
                            <img
                                className="card-poster"
                                src={TMDB_CONFIG.getPoster(movie.poster_path)}
                                alt={movie.title || movie.name}
                            />
                        </motion.div>
                    ))}
                </div>

                <ChevronRight className="row-arrow right" onClick={() => slide('right')} />
            </div>

            <style>{`
                .top10-row {
                    margin: 40px 0;
                    padding: 0 4%;
                }

                .row-title {
                    font-size: 3rem;
                    font-weight: 900;
                    margin-bottom: 30px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    line-height: 1;
                }

                .title-bar {
                    width: 4px;
                    height: 40px;
                    background: #e50914;
                    border-radius: 2px;
                }

                .title-suffix {
                    font-size: 0.8rem;
                    color: #888;
                    font-weight: 600;
                    letter-spacing: 2px;
                    margin-top: 15px;
                }

                .row-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .row-scrollbox {
                    display: flex;
                    overflow-x: scroll;
                    scroll-behavior: smooth;
                    padding: 40px 0 60px 100px;
                }

                .row-scrollbox::-webkit-scrollbar { display: none; }

                .top10-card {
                    display: flex;
                    align-items: baseline;
                    flex: 0 0 auto;
                    position: relative;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .top10-card .card-poster {
                    width: 185px;
                    height: 275px;
                    object-fit: cover;
                    border-radius: 4px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.7);
                    transition: 0.3s;
                    margin-right: 50px;
                    z-index: 2;
                }

                .rank-number {
                    margin-right: -30px;
                    font-size: 9rem;
                    font-weight: 900;
                    line-height: 1;
                    color: black;
                    -webkit-text-stroke: 2px #e50914;
                    z-index: 10;
                    opacity: 1;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    font-family: 'Outfit', sans-serif;
                    position: relative;
                    z-index: 1;
                }

                .top10-card:hover .rank-number {
                    color: #e50914;
                    -webkit-text-stroke: 0px;
                    transform: scale(1.05);
                }

                .top10-card:hover .card-poster {
                    transform: scale(1.02);
                    box-shadow: 0 0 0 2px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.8);
                }

                .row-arrow {
                    position: absolute;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 100;
                    opacity: 0;
                    transition: 0.3s;
                }

                .row-container:hover .row-arrow { opacity: 1; }
                .row-arrow.left { left: 0; }
                .row-arrow.right { right: 0; }

                @media (max-width: 1024px) {
                    .row-scrollbox { padding-left: 80px; }
                    .rank-number { font-size: 8rem; margin-right: -25px; }
                    .top10-card .card-poster { width: 140px; height: 210px; margin-right: 40px; }
                }

                @media (max-width: 768px) {
                    .row-scrollbox { padding-left: 60px; }
                    .rank-number { font-size: 6rem; margin-right: -20px; }
                    .top10-card .card-poster { width: 120px; height: 180px; margin-right: 30px; }
                    .row-title { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default Top10Row;
