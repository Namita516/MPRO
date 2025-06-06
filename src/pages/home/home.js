import React, { useEffect, useState } from "react"
import "./home.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList2 from "../../components/movieList/movielist2";

const Home = () => {

    const [ popularMovies, setPopularMovies ] = useState([])

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US")
        .then(res => res.json())
        .then(data => setPopularMovies(data.results))
    }, [])

    return (
        <>
            <div className="poster">
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {
                        popularMovies.map(movie => (
                            <Link style={{textDecoration:"none",color:"white"}} to={`/movie/${movie.id}`} >
                                <div className="posterImage">
                                    <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.original_title: ""}</div>
                                    <div className="posterImage__runtime">
                                        {movie ? movie.release_date : ""}
                                        <span className="posterImage__rating">
                                            {movie ? movie.vote_average :""}
                                            <i className="fas fa-star" />{" "}
                                        </span>
                                    </div>
                                    
                                    <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                                    <div className="button">
                                    <span className="but">Watch Trailer </span>
                                    <span className="movie__heButton movie__Butt">More info</span>
                </div>
                                </div>
                                
                            </Link>
                        ))
                    }
                </Carousel>
                <div className="button">
                                    <span className="movie__1Button">Trendings</span>
                                    <span className="movie__2Button ">Top-Rated</span>
                                    <span className="movie__3Button ">Coming Soon</span>
                                    <span className="movie__4Button ">Awards</span>
                </div>
                <MovieList2 />
                
                
            </div>
        </>
    )
}

export default Home