import React from 'react';

const MovieList = ({ movies, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movies.length) {
    return <div>No movies found</div>;
  }

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <h3>{movie.title}</h3>
          <p>{movie.genre} | {movie.year} | {movie.actor}</p>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
