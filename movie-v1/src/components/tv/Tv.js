import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Trailer from '../trailer/Trailer';
import '../movies/Movies.css'; 

const Tv = () => {
    const [tvGrid, setTvGrid] = useState([]);
    const [trailerTvId, setTrailerTvId] = useState(null);
    const TMDB_API_KEY = "167f9a8cad1891d895d3c0c79d6917fd";

    useEffect(() => {
        const fetchTvShows = async () => {
            try {
                // Fetching the TV specific endpoint
                const res = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
                
                // TMDB's list endpoint does not include 'number_of_seasons', so we perform supplementary fetches
                const detailedPromises = res.data.results.map(async (show) => {
                    try {
                        const detailRes = await axios.get(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${TMDB_API_KEY}&language=en-US`);
                        return { ...show, number_of_seasons: detailRes.data.number_of_seasons };
                    } catch (e) {
                        return show;
                    }
                });
                
                const detailedShows = await Promise.all(detailedPromises);
                setTvGrid(detailedShows);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTvShows();
    }, []);

    return (
        <div className="movies-page-container">
            <h2 className="movies-page-title">Popular Web Series</h2>
            <div className="movies-grid">
                {tvGrid.map((tv) => (
                    <div className="movie-card" key={tv.id}>
                        <img 
                            src={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                            alt={tv.name} 
                            className="movie-poster"
                        />
                        <div className="movie-card-overlay">
                            {/* TV uses "name" instead of "title" in TMDB api */}
                            <h4 className="movie-card-title">{tv.name}</h4>
                            <p className="movie-card-rating">
                                ⭐ {tv.vote_average?.toFixed(1) || 'N/A'}
                                {tv.number_of_seasons && (
                                    <span style={{marginLeft: '10px', color: '#fff', fontSize: '0.95rem', fontWeight: '500'}}>
                                        • {tv.number_of_seasons} Season{tv.number_of_seasons !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </p>
                            <div className="movie-card-buttons">
                                <button className="card-btn play" onClick={() => setTrailerTvId(tv.id)}>Trailer</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* We pass mediaType="tv" so the Trailer modal queries the exact right API endpoint */}
            <Trailer isOpen={!!trailerTvId} movieId={trailerTvId} mediaType="tv" onClose={() => setTrailerTvId(null)} />
        </div>
    );
};

export default Tv;
