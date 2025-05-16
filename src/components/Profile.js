import React, { useState, useEffect } from 'react';
import './Profile.css';

const movieGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Animation'
];

const UserProfile = () => {

  // Load user data from localStorage or set default values
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'This is my bio',
      profilePicture: 'https://freesvg.org/img/abstract-user-flat-3.png',
      moviePreferences: [],
      watchlist: [],
      ratedMovies: [
        { id: 1, title: 'Movie 1', rating: 5 },
        { id: 2, title: 'Movie 2', rating: 4 },
      ],
      reviews: [
        { id: 1, movieTitle: 'Movie 1', review: 'This is a great movie!' },
        { id: 2, movieTitle: 'Movie 2', review: 'This is an okay movie.' },
      ],
    };
    return storedUser;
  });

  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.profilePicture);
  const [favoriteActors, setFavoriteActors] = useState([]);

  // Save user data whenever it updates
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setUser((prevUser) => ({ ...prevUser, watchlist: savedWatchlist }));
  }, []);

  // Remove movie from watchlist
  const removeFromWatchlist = (movieId) => {
    const updatedWatchlist = user.watchlist.filter((movie) => movie.id !== movieId);
    setUser((prevUser) => ({ ...prevUser, watchlist: updatedWatchlist }));
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  // Load favorite actors from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteActors')) || [];
    setFavoriteActors(savedFavorites);
  }, []);

  // Remove actor from favorite actors list
  const handleRemoveFavorite = (actorId) => {
    const updatedFavorites = favoriteActors.filter((actor) => actor.id !== actorId);
    setFavoriteActors(updatedFavorites);
    localStorage.setItem('favoriteActors', JSON.stringify(updatedFavorites));
  };

  // Handle genre preference change
  const handleGenreChange = (genre) => {
    setUser((prevUser) => {
      const updatedPreferences = prevUser.moviePreferences.includes(genre)
        ? prevUser.moviePreferences.filter((g) => g !== genre)
        : [...prevUser.moviePreferences, genre];

      return { ...prevUser, moviePreferences: updatedPreferences };
    });
  };

  return (
    <div className="user-profile">
      <div className="user">
        <div className="img">
          <div className="profile-info">
            {editing ? (
              <input type="file" name="profilePicture" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setUser({ ...user, profilePicture: imageUrl });
                  setImagePreview(imageUrl);
                }
              }} />
            ) : (
              <img src={imagePreview} alt="Profile" />
            )}
          </div>
        </div>

        <div className="info">
          <div className="profile-info">
            <label>Name:</label>
            {editing ? (
              <input type="text" name="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            ) : (
              <p>{user.name}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="profile-info">
            <label>Bio:</label>
            {editing ? (
              <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
            ) : (
              <p>{user.bio}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Movie Preferences:</label>
            {editing ? (
              <div className="genre-list">
                {movieGenres.map((genre) => (
                  <label key={genre} className="genre-label">
                    <input
                      type="checkbox"
                      checked={user.moviePreferences.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    {genre}
                  </label>
                ))}
              </div>
            ) : (
              <p>{user.moviePreferences.length > 0 ? user.moviePreferences.join(', ') : 'No preferences selected'}</p>
            )}
          </div>
        </div>

        <div className="edit">
          {editing ? (
            <button onClick={() => setEditing(false)}>Save Changes</button>
          ) : (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      {/* Movie Sections */}
      <div className="movie-sections">
        <div className="section">
          <h3>Watchlist</h3>
          {user.watchlist.length === 0 ? (
            <p>No movies in your watchlist.</p>
          ) : (
            <div className="movie-list">
              {user.watchlist.map((movie) => (
                <div key={movie.id} className="movie-item">
                  <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/150'} alt={movie.title} />
                  <p>{movie.title}</p>
                  <button onClick={() => removeFromWatchlist(movie.id)} className="remove-btn">❌ Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3>Rated Movies</h3>
          <div className="movie-list">
            {user.ratedMovies.map((movie) => (
              <div key={movie.id} className="movie-item">
                <p>{movie.title} - Rating: {movie.rating} / 5</p>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <h3>Reviews</h3>
          {user.reviews.length === 0 ? (
            <p>No reviews written yet.</p>
          ) : (
            <div className="movie-list">
              {user.reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <h4>{review.movieTitle}</h4>
                  <p>{review.review}</p>
                  <p>Rating: {review.rating}/5</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Actors Section */}
        <div className="section">
          <h3>Favorite Actors</h3>
          {favoriteActors.length === 0 ? (
            <p>No favorite actors added.</p>
          ) : (
            <div className="actor-list">
              {favoriteActors.map((actor) => (
                <div key={actor.id} className="actor-item">
 <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/150'} 
                    alt={actor.name} 
                  />                  <p>{actor.name}</p>
                  <button onClick={() => handleRemoveFavorite(actor.id)} className="remove-btn">❌ Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

