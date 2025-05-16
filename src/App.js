import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReviewProvider } from './components/ReviewContext';
import Header from './components/header/Header';
import Home from './pages/home/home';
import MovieList from './components/movieList/movieList';
import Movie from './pages/movieDetail/movie';
import ActorProfile from './components/ActorProfile';
import FavoriteActors from './components/FavoriteActors';
import Profile from "./components/Profile";
import { AuthProvider } from './components/AuthContext';
import Login from './components/Login';
import Signup from './components/SIgnup';
function App() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <div className="App">
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<FavoriteActors />} />
              <Route path="/movie/:id" element={<Movie />} />
              <Route path="/movies/:type" element={<MovieList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/actor/:actorId" element={<ActorProfile />} />
              <Route path="/*" element={<h1>Error Page</h1>} />
            </Routes>
          </Router>
        </div>
      </ReviewProvider>
    </AuthProvider>
  );
}

export default App;
