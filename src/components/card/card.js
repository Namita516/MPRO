import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./card.css";
import { Link } from "react-router-dom";

const Cards = ({ movie }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Load ratings from localStorage
        loadRating();
    }, []);

    const loadRating = () => {
        const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
        const movieRatings = storedRatings[movie.id] || [];
        if (movieRatings.length > 0) {
            const avg = movieRatings.reduce((sum, rating) => sum + rating, 0) / movieRatings.length;
            setAverageRating(avg.toFixed(1));
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="cards">
                    <SkeletonTheme color="#202020" highlightColor="#444">
                        <Skeleton height={300} duration={2} />
                    </SkeletonTheme>
                </div>
            ) : (
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                    <div className="cards">
                        <img className="cards__img" src={`https://image.tmdb.org/t/p/original${movie?.poster_path || ""}`} alt={movie?.original_title} />

                        <div className="cards__overlay">
                            <div className="card__title">{movie?.original_title || ""}</div>
                            <div className="card__runtime">
                                {movie?.release_date || ""}
                            </div>

                            {/* Display dynamically updated average rating */}
                            <div className="card__rating">⭐ {averageRating || "Not Rated"}</div>

                            <div className="card__description">
                                {movie ? movie.overview.slice(0, 118) + "..." : ""}
                            </div>
                        </div>
                    </div>
                    <span className="but">View Details</span>
                </Link>
            )}
        </>
    );
};

export default Cards;
