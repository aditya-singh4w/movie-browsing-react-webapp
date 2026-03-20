import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Trailer from '../trailer/Trailer';
import './Discover.css';

const Discover = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [moviesGrid, setMoviesGrid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trailerMovieId, setTrailerMovieId] = useState(null);
    const TMDB_API_KEY = "167f9a8cad1891d895d3c0c79d6917fd";

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
                setGenres(res.data.genres);
                if (res.data.genres.length > 0) {
                    setSelectedGenre(res.data.genres[0].id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        if (!selectedGenre) return;

        const fetchMoviesByGenre = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${selectedGenre}&sort_by=popularity.desc&page=1`);
                setMoviesGrid(res.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMoviesByGenre();
    }, [selectedGenre]);

    return (
        <div className="discover-page-container">
            <h2 className="discover-page-title">Discover Movies</h2>
            
            {/* Genre Selector */}
            <div className="genre-selector">
                {genres.map((genre) => (
                    <button 
                        key={genre.id} 
                        className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
                        onClick={() => setSelectedGenre(genre.id)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="discover-loading">
                    <h2>Loading {genres.find(g => g.id === selectedGenre)?.name} Movies...</h2>
                </div>
            ) : (
                <div className="movies-grid">
                    {moviesGrid.length === 0 ? (
                        <div className="no-movies">
                            <p>No movies found for this category.</p>
                        </div>
                    ) : (
                        moviesGrid.map((movie) => (
                            <div className="movie-card" key={movie.id}>
                                <img 
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                                    alt={movie.title} 
                                    className="movie-poster"
                                />
                                <div className="movie-card-overlay">
                                    <h4 className="movie-card-title">{movie.title}</h4>
                                    <p className="movie-card-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                                    <div className="movie-card-buttons">
                                        <button className="card-btn play" onClick={() => setTrailerMovieId(movie.id)}>Trailer</button>
                                        <Link to={`/Reviews/${movie.id}`} className="card-btn details">Reviews</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            
            <Trailer isOpen={!!trailerMovieId} movieId={trailerMovieId} onClose={() => setTrailerMovieId(null)} />
        </div>
    );
};

export default Discover;
