import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FavoriteActors.css";

const FavoriteActors = () => {
    const [favoriteActors, setFavoriteActors] = useState([]);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favoriteActors")) || [];
        setFavoriteActors(savedFavorites);
    }, []);

    const removeFavorite = (actorId) => {
        const updatedFavorites = favoriteActors.filter(actor => actor.id !== actorId);
        setFavoriteActors(updatedFavorites);
        localStorage.setItem("favoriteActors", JSON.stringify(updatedFavorites));
    };

    return (
        <div className="favorite-actors">
            <h1>Favorite Actors</h1>
            {favoriteActors.length === 0 ? (
                <p>No favorite actors added yet.</p>
            ) : (
                <div className="actors-container">
                    {favoriteActors.map(actor => (
                        <div key={actor.id} className="actor-card">
                            <Link to={`/actor/${actor.id}`}>
                                <img className="actor-image" src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                                <p className="actor-name">{actor.name}</p>
                            </Link>
                            <button className="remove-btn" onClick={() => removeFavorite(actor.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteActors;
