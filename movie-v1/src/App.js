import './App.css';
import api from './api/axiosConfig';
import axios from 'axios';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import NotFound from './components/notFound/NotFound';
import Movies from './components/movies/Movies';
import Tv from './components/tv/Tv';
import Discover from './components/discover/Discover';

function App() {

  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);

  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || "167f9a8cad1891d895d3c0c79d6917fd";

  const getMovies = async () =>{
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      setMovies(response.data.results);
    } 
    catch(err) {
      console.log(err);
    }
  }

  const getMovieData = async (movieId) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`);
        const singleMovie = response.data;
        setMovie(singleMovie);

        // Instantly get hundreds of real production reviews for the movie too!
        const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`);
        // Format TMDB reviews to match what our React app expects { body: "" }
        const mappedReviews = reviewsResponse.data.results.map(r => ({ body: r.content + " \n\n— " + r.author }));
        setReviews(mappedReviews);
    } 
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMovies();
  },[])

  return (
    <div className="App">
      <Header/>
      <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Home movies={movies} />} ></Route>
            <Route path="/discover" element={<Discover />} ></Route>
            <Route path="/movies" element={<Movies />} ></Route>
            <Route path="/tv" element={<Tv />} ></Route>
            <Route path="/Reviews/:movieId" element ={<Reviews getMovieData = {getMovieData} movie={movie} reviews ={reviews} setReviews = {setReviews} />}></Route>
            <Route path="*" element = {<NotFound/>}></Route>
          </Route>
      </Routes>

    </div>
  );
}

export default App;



//0otBaD9eqTVndx8o