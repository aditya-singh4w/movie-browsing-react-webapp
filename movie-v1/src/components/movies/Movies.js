import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Trailer from '../trailer/Trailer';
import './Movies.css';

const Movies = () => {
    const [moviesGrid, setMoviesGrid] = useState([]);
    const [trailerMovieId, setTrailerMovieId] = useState(null);
    const TMDB_API_KEY = "167f9a8cad1891d895d3c0c79d6917fd";

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Fetching the "now playing" catalog for a different feed than the popular feed
                const res = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
                setMoviesGrid(res.data.results);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="movies-page-container">
            <h2 className="movies-page-title">Now Playing in Theaters</h2>
            <div className="movies-grid">
                {moviesGrid.map((movie) => (
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
                ))}
            </div>
            <Trailer isOpen={!!trailerMovieId} movieId={trailerMovieId} onClose={() => setTrailerMovieId(null)} />
        </div>
    );
};

export default Movies;
