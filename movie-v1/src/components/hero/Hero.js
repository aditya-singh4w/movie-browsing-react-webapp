import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Trailer from '../trailer/Trailer';
import "./Hero.css";

const Hero = ({ movies }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerMovieId, setTrailerMovieId] = useState(null);
  const heroMovies = movies?.slice(0, 5) || [];

  // Auto slide every 5 seconds
  useEffect(() => {
    if (heroMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroMovies.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const goToNext = () => {
    setCurrentIndex(prev => prev === heroMovies.length - 1 ? 0 : prev + 1);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => prev === 0 ? heroMovies.length - 1 : prev - 1);
  };

  const movie = heroMovies[currentIndex];
  
  if (!movies) {
    return (
      <div className="hero-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Movies...</h2>
      </div>
    );
  }

  if (heroMovies.length === 0) {
    return (
      <div className="hero-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>No movies found</h2>
          <p>Please check your internet connection or API key.</p>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div
      className="hero-container"
      style={{
        backgroundImage: `url(${backdropUrl})`
      }}
    >
      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">

        {/* Tags */}
        <div className="hero-tags">
          <span className="tag">MUST WATCH</span>
          <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          <span>{movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">{movie.title}</h1>

        {/* Description */}
        <p className="hero-description">
          {movie.overview}
        </p>

        {/* Buttons */}
        <div className="hero-buttons">

          {/* Play button -> triggers modal */}
          <button className="play-btn" onClick={() => setTrailerMovieId(movie.id)}>▶ Play Now</button>

          <Link to={`/Reviews/${movie.id}`}>
            <button className="info-btn">Reviews</button>
          </Link>

        </div>

      </div>

      {/* Navigation Arrows */}
      <div className="hero-nav left" onClick={goToPrev}>
        <FaChevronLeft />
      </div>
      <div className="hero-nav right" onClick={goToNext}>
        <FaChevronRight />
      </div>

      {/* Dots */}
      <div className="dots">
        {heroMovies.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? "active" : ""}`}
          ></span>
        ))}
      </div>

      <Trailer isOpen={!!trailerMovieId} movieId={trailerMovieId} onClose={() => setTrailerMovieId(null)} />
    </div>
  );
};

export default Hero;