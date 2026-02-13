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
                    gap: 60px;
                    overflow-x: scroll;
                    scroll-behavior: smooth;
                    padding: 20px 0 30px 60px;
                }

                .row-scrollbox::-webkit-scrollbar { display: none; }

                .top10-card {
                    flex: 0 0 180px;
                    position: relative;
                    cursor: pointer;
                    height: 270px;
                }

                .rank-number {
                    position: absolute;
                    left: -50px;
                    bottom: -20px;
                    font-size: 11rem;
                    font-weight: 800;
                    line-height: 0.8;
                    color: black;
                    -webkit-text-stroke: 2px #e50914;
                    z-index: -1;
                    opacity: 1;
                    transform: translateX(10%);
                }

                .top10-card .card-poster {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 4px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.7);
                }

                .row-arrow {
                    position: absolute;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    opacity: 0;
                    transition: 0.3s;
                }

                .row-container:hover .row-arrow { opacity: 1; }
                .row-arrow.left { left: 0; }
                .row-arrow.right { right: 0; }

                @media (max-width: 768px) {
                    .row-scrollbox { gap: 40px; padding-left: 40px; }
                    .top10-card { flex: 0 0 140px; height: 210px; }
                    .rank-number { font-size: 7rem; left: -35px; bottom: -10px; }
                    .row-title { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default Top10Row;
