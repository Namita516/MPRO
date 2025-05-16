import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./movie.css";

const API_KEY = "11194ae9f15c5c4c69f145c8b1a5a4be";


const Movie = () => {
  const [movieDetail, setMovieDetail] = useState(null);
    const [cast, setCast] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [tmdbReviews, setTmdbReviews] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [sortOption, setSortOption] = useState("mostRecent");
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [trailers, setTrailers] = useState([]);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);

    useEffect(() => {
        fetchMovieDetails();
        fetchMovieCast();
        loadWatchlist();
        loadReviews();
        loadRating();
        window.scrollTo(0, 0);
        fetchImages().then((data) => setImages(data));  // fetching images for the specific movie
        fetchTrailers();
        fetchReviews();
      }, [id]);
      const fetchTrailers = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const data = await response.json();
        const filteredTrailers = data.results.filter(video => video.type === "Trailer" && video.site === "YouTube");
        setTrailers(filteredTrailers);
    };
    const nextTrailer = () => {
      setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % trailers.length);
  };

  const prevTrailer = () => {
      setCurrentTrailerIndex((prevIndex) => (prevIndex - 1 + trailers.length) % trailers.length);
  };

      const fetchImages = async () => {
        try {
          // Fetch images for the specific movie by using the movie ID
          const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`);
          const data = await response.json();
      
          // Extract image paths from the response and return them
          return data.backdrops.map(image => image.file_path);
        } catch (error) {
          console.error("Error fetching movie images:", error);
        }
      };
    const fetchMovieDetails = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        setMovieDetail(data);
    };

    const fetchMovieCast = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`);
        const data = await response.json();
        setCast(data.cast.slice(0, 10));
    };

    const loadWatchlist = () => {
        const storedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(storedWatchlist);
    };

    const toggleWatchlist = () => {
        let updatedWatchlist = [...watchlist];
        if (watchlist.some(movie => movie.id === movieDetail.id)) {
            updatedWatchlist = updatedWatchlist.filter(movie => movie.id !== movieDetail.id);
        } else {
            updatedWatchlist.push({
                id: movieDetail.id,
                title: movieDetail.original_title,
                poster_path: movieDetail.poster_path
            });
        }
        setWatchlist(updatedWatchlist);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    };
    
    const loadRating = () => {
        const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
        const movieRatings = storedRatings[id] || [];
        if (movieRatings.length > 0) {
            const avg = movieRatings.reduce((sum, rating) => sum + rating, 0) / movieRatings.length;
            setAverageRating(avg.toFixed(1));
        }
    }; 
    const handleRating = (newRating) => {
        const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
        const movieRatings = storedRatings[id] || [];
        movieRatings.push(newRating);
        storedRatings[id] = movieRatings;
        localStorage.setItem("ratings", JSON.stringify(storedRatings));

        const avg = movieRatings.reduce((sum, rating) => sum + rating, 0) / movieRatings.length;
        setAverageRating(avg.toFixed(1));
        setRating(newRating);
    };
    const loadReviews = () => {
      const storedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
      setUserReviews(storedReviews);
    };
    
  
  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    let updatedReviews = [...userReviews];
    if (editMode !== null) {
        updatedReviews[editMode].text = reviewText;
        setEditMode(null);
    } else {
        updatedReviews.push({
            id: Date.now(),
            text: reviewText,
            upvotes: 0,
            downvotes: 0,
            timestamp: Date.now(),
        });
    }
    setUserReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
    setReviewText("");
};


const deleteReview = (reviewId) => {
  const updatedReviews = userReviews.filter(review => review.id !== reviewId);
  setUserReviews(updatedReviews);
  localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
};
   
    
    const Carousel = ({ images }) => {
      const [currentIndex, setCurrentIndex] = useState(0);
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentIndex((currentIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(intervalId);
      }, [currentIndex, images]);
    
      const handlePreviousClick = () => {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
      };
    
      const handleNextClick = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
      };
    
      return (
        <div className="carousel">
          <img 
            src={`https://image.tmdb.org/t/p/w500${images[currentIndex]}`} 
            alt="Movie Scene" 
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
         
        </div>
      );
    };
    
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        if (data.results) {
          setTmdbReviews(data.results);
        }
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      }
    };
    
 
const voteReview = (reviewId, type) => {
  const updatedReviews = userReviews.map(review => {
      if (review.id === reviewId) {
          return {
              ...review,
              upvotes: type === "up" ? review.upvotes + 1 : review.upvotes,
              downvotes: type === "down" ? review.downvotes + 1 : review.downvotes,
          };
      }
      return review;
  });
  setUserReviews(updatedReviews);
  localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
};

    const sortedReviews = [...userReviews].sort((a, b) => {
        if (sortOption === "mostHelpful") return b.upvotes - a.upvotes;
        return b.timestamp - a.timestamp;
    });

   
    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${movieDetail?.backdrop_path}`} alt="backdrop" />
            </div>

            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${movieDetail?.poster_path}`} alt="poster" />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{movieDetail?.original_title}</div>
                        <div className="movie__tagline">{movieDetail?.tagline}</div>
                        <div className="movie__tagline">{movieDetail?.tagline}</div>
                    <div className="movie__rating">⭐ {averageRating || "Not Rated"}</div>

                    {/* Star Rating Component */}
                    <div className="rating-section">
                        <h3>Rate this Movie:</h3>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star filled" : "star"}
                                    onClick={() => handleRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                        <div className="movie__genres">
                            {movieDetail?.genres.map(genre => (
                                <span key={genre.id} className="movie__genre">{genre.name}</span>
                            ))}
                        </div>
                        <div className="mov">
                            <div className="mov1"><div className="movie__runtime">{movieDetail?.runtime} mins</div></div>
                            <div className="mov1"><div className="movie__releaseDate">{movieDetail?.release_date}</div></div>
                        </div>
                        
                        {/* Watchlist Button */}
                        <button className="watchlist-button" onClick={toggleWatchlist}>
                            {watchlist.some(movie => movie.id === movieDetail?.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="movie__detailRightBottom">
                <h2>Overview</h2>
                <p>{movieDetail?.overview}</p>
            </div>

            <div className="text">Awards & Recognition</div>
            <div className="button2">
                <span className="butt">Academy Award Nominee</span>
                <span className="movie__heButt movie__But">Golden Globe Nominee</span>
            </div>
            <div className="button2">
                <span className="butt">Metacritic 81/100</span>
                <span className="movie__heButt movie__But">Rotten Tomatoes: 94%</span>
            </div> 
            <div className="section">
      <div className="left-part">
      <div className="carousel-right" style={{ width: '100%', height: '100%' }}>
                    {trailers.length > 0 ? (
                        <div className="trailer-carousel" style={{height:'100%',display:'flex'}}>
                          <div className="carousel-buttons">
                          <button onClick={prevTrailer}   style={{ marginTop: '220px', backgroundColor: 'black', color: 'white', padding: '10px 10px', border: 'none', cursor: 'pointer' , borderRadius:'100px'}}
                          >❮</button>
                          </div>
                              {/* Trailer Display with Auto Play and OnEnd Event */}
            <iframe
              src={`https://www.youtube.com/embed/${trailers[currentTrailerIndex]?.key}?autoplay=1&rel=0&controls=1&showinfo=0`}
              title="Trailer"
              allowFullScreen
              onEnded={nextTrailer} // Switch to the next trailer when it ends
              style={{ width: '100%', height: '100%' }}
            ></iframe>
            <div className="carousel-buttons">
                          <button onClick={prevTrailer}   style={{ marginTop: '220px', backgroundColor: 'black', color: 'white', padding: '10px 10px', border: 'none', cursor: 'pointer' , borderRadius:'100px'}}
                          >❯</button>
                          </div>
                          
                        </div>
                    ) : <p>No trailers available</p>}
                </div>      </div>
      <div className="right-part">
        <Carousel images={images} />
        <Carousel images={images} />

      </div>
    </div>

            {/* 🎭 Top Cast Section */}
            <h2 className="cast__heading">Top Cast</h2>
            <div className="cast__container">
                {cast.map(actor => (
                    <div key={actor.id} className="cast__card">
                        {/* Actor Image with Clickable Link */}
                        <Link to={`/actor/${actor.id}`}>
                            <img 
                                className="cast__image" 
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/150"} 
                                alt={actor.name} 
                            />
                        </Link>
                        <div className="cast__info">
                            <p className="cast__name">{actor.name}</p>
                            <p className="cast__character">as {actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>

        {/* Reviews Section */}
              <div className="reviewtmdb">

        <h2 className="reviews__heading">Reviews</h2>
{tmdbReviews.length > 0 ? (
  tmdbReviews.map((review) => (
    <div key={review.id} className="review__card">
      <p className="review__text">{review.content}</p>
      <p className="review__author">— {review.author}</p>
    </div>
  ))
) : (
  <p className="no__reviews">No critic reviews available.</p>
)}
</div>
      <div className="review-section">
      <div className="reviews-container">
  {userReviews.length > 0 ? (
    [...userReviews]
      .sort((a, b) =>
        sortOption === "mostHelpful" ? b.upvotes - a.upvotes : b.timestamp - a.timestamp
      )
      .map((review) => (
        <div key={review.id} className="review__card">
          <p className="review__text">{review.text}</p>
          <div className="review__actions">
            <button onClick={() => voteReview(review.id, "up")}>👍 {review.upvotes}</button>
            <button onClick={() => voteReview(review.id, "down")}>👎 {review.downvotes}</button>
            <button
              onClick={() => {
                setReviewText(review.text);
                setEditMode(userReviews.indexOf(review));
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteReview(review.id)}>Delete</button>
          </div>
        </div>
      ))
  ) : (
    <p className="no__reviews">No reviews yet. Be the first to review!</p>
  )}
</div>

        <div className="review-form">
          <h2 className="reviews__heading">Reviews</h2>
          <textarea
            className="review__input"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button className="review__submit" onClick={handleReviewSubmit}>
            {editMode !== null ? "Edit Review" : "Submit Review"}
          </button>
          <div className="review__sort">
            <label>Sort by: </label>
            <select onChange={(e) => setSortOption(e.target.value)}>
              <option value="mostRecent">Most Recent</option>
              <option value="mostHelpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Movie;