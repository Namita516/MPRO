import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ActorProfile.css";

const API_KEY = "11194ae9f15c5c4c69f145c8b1a5a4be";
const BASE_URL = "https://api.themoviedb.org/3";

const ActorProfile = () => {
    const { actorId } = useParams();
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                const actorResponse = await fetch(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}`);
                const actorData = await actorResponse.json();
                setActor(actorData);

                const moviesResponse = await fetch(`${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`);
                const moviesData = await moviesResponse.json();
                setMovies(moviesData.cast);

                // Check if actor is already in favorites
                const savedFavorites = JSON.parse(localStorage.getItem("favoriteActors")) || [];
                setIsFavorite(savedFavorites.some(fav => fav.id === actorData.id));
            } catch (error) {
                console.error("Error fetching actor details:", error);
            }
        };

        fetchActorDetails();
    }, [actorId]);

    const toggleFavorite = () => {
        let savedFavorites = JSON.parse(localStorage.getItem("favoriteActors")) || [];
        
        if (isFavorite) {
            // Remove from favorites
            savedFavorites = savedFavorites.filter(fav => fav.id !== actor.id);
        } else {
            // Add to favorites
            const newFavorite = { id: actor.id, name: actor.name, profile_path: actor.profile_path };
            savedFavorites.push(newFavorite);
        }

        // Update localStorage
        localStorage.setItem("favoriteActors", JSON.stringify(savedFavorites));
        setIsFavorite(!isFavorite);
    };

    if (!actor) {
        return <p>Loading actor details...</p>;
    }

    return (
        <div className="actor-profile">
            <div className="actor-header">
                <img className="actor-image" src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                <div className="actor-info">
                    <h1 className="actor-name">{actor.name}</h1>
                    <p className="actor-bio">{actor.biography || "No biography available."}</p>
                    <button className="favorite-btn" onClick={toggleFavorite}>
                        {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
                    </button>
                </div>
            </div>

            <div className="movies-list">
                <h2>Movies:</h2>
                <div className="movies-container">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <p className="movie-title">{movie.title} ({movie.release_date?.split("-")[0]})</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActorProfile;
