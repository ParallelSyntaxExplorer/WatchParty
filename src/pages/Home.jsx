import React, { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Top10Row from '../components/Top10Row';
import {
    fetchTrending,
    fetchMovies,
    fetchTVShows,
    fetchByProvider,
    fetchByGenre,
    WATCH_PROVIDERS,
    GENRE_IDS
} from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

const Home = ({ watchlist, history }) => {
    const navigate = useNavigate();

    // Main Data State
    const [trending, setTrending] = useState([]);

    // Rows State
    const [trendingToday, setTrendingToday] = useState([]);
    const [trendingType, setTrendingType] = useState('movie'); // 'movie' or 'tv'

    const [providerContent, setProviderContent] = useState([]);
    const [activeProvider, setActiveProvider] = useState('NETFLIX');

    const [topRated, setTopRated] = useState([]);
    const [topRatedType, setTopRatedType] = useState('movie');

    const [genreContent, setGenreContent] = useState([]);
    const [activeGenre, setActiveGenre] = useState('ACTION');

    const loadInitialData = useCallback(async () => {
        try {
            const [trendingData, trendingTodayData, netflixData, topRatedData, genreData] = await Promise.all([
                fetchTrending('all', 'day'),
                fetchTrending('movie', 'day'),
                fetchByProvider('tv', WATCH_PROVIDERS.NETFLIX),
                fetchMovies('top_rated'),
                fetchByGenre('movie', GENRE_IDS.ACTION)
            ]);
            setTrending(trendingData);
            setTrendingToday(trendingTodayData);
            setProviderContent(netflixData);
            setTopRated(topRatedData);
            setGenreContent(genreData);
        } catch (error) {
            console.error("Failed to load initial data:", error);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleSelect = (content) => {
        const type = content.media_type || (content.first_air_date ? 'tv' : 'movie');
        navigate(`/watch/${type}/${content.id}`);
    };

    // Update Trending Today on Tab Change
    useEffect(() => {
        const updateTrending = async () => {
            const data = await fetchTrending(trendingType, 'day');
            setTrendingToday(data);
        };
        updateTrending();
    }, [trendingType]);

    // Update Platform Content on Tab Change
    useEffect(() => {
        const updateProvider = async () => {
            const data = await fetchByProvider('tv', WATCH_PROVIDERS[activeProvider]);
            setProviderContent(data);
        };
        updateProvider();
    }, [activeProvider]);

    // Update Top Rated on Tab Change
    useEffect(() => {
        const updateTopRated = async () => {
            const data = topRatedType === 'movie' ? await fetchMovies('top_rated') : await fetchTVShows('top_rated');
            setTopRated(data);
        };
        updateTopRated();
    }, [topRatedType]);

    // Update Genre Content on Tab Change
    useEffect(() => {
        const updateGenre = async () => {
            const data = await fetchByGenre('movie', GENRE_IDS[activeGenre]);
            setGenreContent(data);
        };
        updateGenre();
    }, [activeGenre]);

    return (
        <div className="home-page">
            {trending.length > 0 && (
                <Hero
                    movies={trending}
                    onPlay={(movie) => handleSelect(movie)}
                />
            )}

            <div className="home-content-sections">
                {history && history.length > 0 && (
                    <MovieRow
                        title="Continue Watching"
                        movies={history}
                        onSelect={handleSelect}
                    />
                )}

                {watchlist && watchlist.length > 0 && (
                    <MovieRow
                        title="My Watchlist"
                        movies={watchlist}
                        onSelect={handleSelect}
                    />
                )}

                <Top10Row
                    title="TOP 10"
                    movies={trending}
                    onSelect={handleSelect}
                />

                <MovieRow
                    title="Trending Today"
                    movies={trendingToday}
                    onSelect={handleSelect}
                    tabs={[
                        { id: 'movie', label: 'Movies' },
                        { id: 'tv', label: 'Series' }
                    ]}
                    activeTab={trendingType}
                    onTabChange={setTrendingType}
                />

                <MovieRow
                    title={`Series on ${activeProvider.charAt(0) + activeProvider.slice(1).toLowerCase()}`}
                    movies={providerContent}
                    onSelect={handleSelect}
                    tabs={[
                        { id: 'NETFLIX', label: 'Netflix' },
                        { id: 'PRIME', label: 'Prime' },
                        { id: 'MAX', label: 'Max' },
                        { id: 'DISNEY', label: 'Disney+' },
                        { id: 'APPLE', label: 'AppleTV' },
                        { id: 'PARAMOUNT', label: 'Paramount' }
                    ]}
                    activeTab={activeProvider}
                    onTabChange={setActiveProvider}
                />

                <MovieRow
                    title="Top Rated"
                    movies={topRated}
                    onSelect={handleSelect}
                    tabs={[
                        { id: 'movie', label: 'Movies' },
                        { id: 'tv', label: 'Series' }
                    ]}
                    activeTab={topRatedType}
                    onTabChange={setTopRatedType}
                />

                <MovieRow
                    title="Genres"
                    movies={genreContent}
                    onSelect={handleSelect}
                    tabs={Object.keys(GENRE_IDS).map(g => ({ id: g, label: g.charAt(0) + g.slice(1).toLowerCase() }))}
                    activeTab={activeGenre}
                    onTabChange={setActiveGenre}
                />
            </div>

            <style>{`
                .home-page {
                    background: var(--bg-color);
                    min-height: 100vh;
                }

                .home-content-sections {
                    position: relative;
                    z-index: 5;
                    margin-top: -150px;
                    padding-bottom: 100px;
                    background: linear-gradient(transparent, var(--bg-color) 150px);
                }

                .footer-branding {
                    padding: 40px 6%;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    opacity: 0.6;
                }

                .footer-branding h2 {
                    font-size: 1.2rem;
                    color: white;
                    margin-bottom: 10px;
                }

                .footer-branding p {
                    font-size: 0.8rem;
                    color: #888;
                    max-width: 600px;
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .home-content-sections { margin-top: -80px; }
                }
            `}</style>

            <div className="footer-branding">
                <h2>WatchParty</h2>
                <p>
                    This site does not store any files on our server, we only linked to the media which is hosted on 3rd party.
                </p>
            </div>
        </div>
    );
};

export default Home;
