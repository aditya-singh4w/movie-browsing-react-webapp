import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "./Trailer.css";
import React from "react";

const Trailer = ({ isOpen, onClose, movieId, mediaType = "movie" }) => {
  const [youtubeKey, setYoutubeKey] = useState(null);

  useEffect(() => {
    if (isOpen && movieId) {
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?api_key=167f9a8cad1891d895d3c0c79d6917fd`)
        .then(response => {
          const videos = response.data.results;

          // Find official YouTube trailers and sort by newest first to avoid dead/privated links
          const officialTrailers = videos.filter(v => v.type === "Trailer" && v.site === "YouTube" && v.official);
          officialTrailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

          // Fallbacks if no official trailer exists
          const anyTrailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
          const anyVideo = videos.find(v => v.site === "YouTube");

          const bestVideo = officialTrailers.length > 0 ? officialTrailers[0] : (anyTrailer || anyVideo);

          if (bestVideo) {
            setYoutubeKey(bestVideo.key);
          } else {
            setYoutubeKey(null);
          }
        })
        .catch(err => console.error(err));
    } else {
      setYoutubeKey(null);
    }
  }, [movieId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="trailer-overlay" onClick={onClose}>
      <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
        <FaTimes className="trailer-close-icon" onClick={onClose} />
        <div className="video-wrapper">
          {youtubeKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <h3 style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>No trailer available</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trailer;