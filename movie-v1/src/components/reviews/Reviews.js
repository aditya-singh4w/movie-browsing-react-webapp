import {useEffect, useRef} from 'react';
import api from '../../api/axiosConfig';
import {useParams} from 'react-router-dom';
import ReviewForm from '../reviewForm/ReviewForm';
import './Reviews.css';
import React from 'react'

const Reviews = ({getMovieData,movie,reviews,setReviews}) => {

    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;

    useEffect(()=>{
        getMovieData(movieId);
    },[])

    const addReview = async (e) =>{
        e.preventDefault();

        const rev = revText.current;

        try
        {
            const response = await api.post("/api/v1/reviews",{reviewBody:rev.value,imdbId:movieId});

            const updatedReviews = [...reviews, {body:rev.value}];
    
            rev.value = "";
    
            setReviews(updatedReviews);
        }
        catch(err)
        {
            console.error(err);
        }
    }

  const posterUrl = movie?.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '';

  return (
    <div className="reviews-container">
        <h3 className="reviews-title">Reviews</h3>
        <div className="reviews-layout">
            <div className="reviews-poster">
                <img src={posterUrl} alt={movie?.title || "Movie Poster"} />
            </div>
            <div className="reviews-content">
                <div className="review-form-section">
                    <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                </div>
                <hr className="divider" />
                
                <div className="reviews-list">
                    {
                        reviews?.map((r, index) => {
                            return(
                                <div key={index} className="review-item">
                                    <p className="review-body">{r.body}</p>
                                    <hr className="divider" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        <hr className="divider" />
    </div>
  )
}

export default Reviews;
