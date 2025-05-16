import React, {useEffect, useState} from "react"
import "./movieList.css"
import { useParams } from "react-router-dom"
import Cards1 from "../card/card2"

const MovieList = () => {
    
    const [movieList, setMovieList] = useState([])
    const {type} = useParams()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        getData()
    }, [type])

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular movies"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
        .then(res => res.json())
        .then(data => setMovieList(data.results))
    }

    return (
        <div className="movie__list1">
            <h2 className="list__title">{(type ? type : "Trending Now").toUpperCase()}</h2>
            <div className="list__cards">
                
                {
                    
                    movieList.map(movie => (
                        <Cards1 movie={movie} />
                        
                    ))
                }
                
            </div>

           
          
        </div>
    )
}

export default MovieList