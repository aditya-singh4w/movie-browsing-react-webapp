import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTimes, FaSearch, FaStar } from 'react-icons/fa';
import Trailer from '../trailer/Trailer';
import './Search.css';

const TMDB_API_KEY = "167f9a8cad1891d895d3c0c79d6917fd";

// Generate years from current year down to 1970
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

const FILTERS = ['All', 'Popular', 'Rating', 'Newest', 'Year'];

const Search = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedYear, setSelectedYear] = useState('');
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trailerMovieId, setTrailerMovieId] = useState(null);

    const fetchResults = useCallback(async (query, filter, year) => {
        setLoading(true);
        try {
            let url = '';
            const yearParam = year ? `&primary_release_year=${year}` : '';

            if (query.trim()) {
                // Use search endpoint when user has typed something
                url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1${yearParam}`;
                if (filter === 'TV') {
                    url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1${year ? `&first_air_date_year=${year}` : ''}`;
                }
            } else {
                // Use discover/movie based on filter
                let sortBy = 'popularity.desc';
                if (filter === 'Rating') sortBy = 'vote_average.desc';
                if (filter === 'Newest') sortBy = 'release_date.desc';
                url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=${sortBy}&page=1${yearParam}`;
            }

            const res = await axios.get(url);
            setResults(res.data.results || []);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce search - wait 500ms after user stops typing
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            fetchResults(searchQuery, selectedFilter, selectedYear);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedFilter, selectedYear, isOpen, fetchResults]);

    // Reset state when overlay opens
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedFilter('All');
            setSelectedYear('');
            setResults([]);
            setShowYearDropdown(false);
        }
    }, [isOpen]);

    const handleFilterClick = (filter) => {
        if (filter === 'Year') {
            setShowYearDropdown(prev => !prev);
        } else {
            setShowYearDropdown(false);
            setSelectedFilter(filter);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={(e) => { if (e.target.classList.contains('search-overlay')) onClose(); }}>
            <div className="search-container">
                {/* Search Bar */}
                <div className="search-top">
                    <FaSearch className="search-icon-input" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search movies or TV shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <button className="search-close-btn" onClick={onClose}>
                        <span>Close</span>
                        <FaTimes className="close-icon-sm" />
                    </button>
                </div>

                {/* Filter Chips + Year Dropdown */}
                <div className="search-filters-wrapper">
                    <div className="search-filters">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                className={`filter-chip ${
                                    (filter !== 'Year' && selectedFilter === filter) ||
                                    (filter === 'Year' && selectedYear)
                                        ? 'active' : ''
                                }`}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter === 'Year' && selectedYear ? `${selectedYear} ▼` : filter === 'Year' ? 'Year ▼' : filter}
                            </button>
                        ))}
                    </div>

                    {/* Year Dropdown */}
                    {showYearDropdown && (
                        <div className="year-dropdown">
                            <div
                                className={`year-option ${!selectedYear ? 'active' : ''}`}
                                onClick={() => { setSelectedYear(''); setShowYearDropdown(false); }}
                            >
                                All Years
                            </div>
                            {YEARS.map(year => (
                                <div
                                    key={year}
                                    className={`year-option ${selectedYear === String(year) ? 'active' : ''}`}
                                    onClick={() => { setSelectedYear(String(year)); setShowYearDropdown(false); }}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="search-results-area">
                    {loading ? (
                        <div className="search-status">Searching...</div>
                    ) : !searchQuery && !selectedYear && selectedFilter === 'All' ? (
                        <div className="search-status">Start typing to search for movies or TV shows.</div>
                    ) : results.length === 0 ? (
                        <div className="search-status">No results found. Try a different search.</div>
                    ) : (
                        <div className="search-results-grid">
                            {results.map((item) => (
                                <div className="search-result-card" key={item.id}>
                                    <img
                                        src={item.poster_path
                                            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                            : 'https://via.placeholder.com/300x450?text=No+Poster'}
                                        alt={item.title || item.name}
                                        className="result-poster"
                                    />
                                    <div className="result-overlay">
                                        <h4 className="result-title">{item.title || item.name}</h4>
                                        <p className="result-rating">
                                            <FaStar className="star-icon" /> {item.vote_average?.toFixed(1) || 'N/A'}
                                            {(item.release_date || item.first_air_date) &&
                                                <span className="result-year"> • {(item.release_date || item.first_air_date)?.substring(0, 4)}</span>
                                            }
                                        </p>
                                        <div className="result-buttons">
                                            <button className="res-btn play" onClick={() => setTrailerMovieId(item.id)}>Trailer</button>
                                            <Link to={`/Reviews/${item.id}`} className="res-btn details" onClick={onClose}>Reviews</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Trailer isOpen={!!trailerMovieId} movieId={trailerMovieId} onClose={() => setTrailerMovieId(null)} />
        </div>
    );
};

export default Search;
