import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/movies";

export const getMovies = () => axios.get(API_URL);