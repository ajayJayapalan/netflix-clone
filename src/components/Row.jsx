import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer';
import axios from "../axios";
import "./Row.css";

const baseURL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {

  const [movies, setMovies] = useState([]);
  const [trailerUrl,setTrailerUrl] = useState('')

  // a snippet of code which runs based on a specific condition
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;  // it is important to return the request
    }
    fetchData();
  }, [fetchUrl]);


  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 0,
    }
  }

  //console.table(movies);

  const handleClick=(movie)=>{
    if(trailerUrl)
    {
      setTrailerUrl('')
    }else{
      
      movieTrailer(movie.title|| movie.name || "")
      .then(url => {
       // console.log(movie.name)
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
      }).catch((error) => console.log(error));
    }
  }

  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__posters">
        {/* several row posters */}

        {movies.map((movie) => {
          return (
            <img
            onClick={()=>{
           //  console.log(movie.name)
              handleClick(movie)}}
              key={movie.id}
              src={`${baseURL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              alt={movie.name}
            />
          );
        })}
      </div>
      {/* container -> poster */}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
