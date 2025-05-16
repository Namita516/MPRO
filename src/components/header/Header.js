import React, { useState, useEffect, useRef } from "react";
import { Link , useNavigate} from "react-router-dom";
import "./Header.css";
import { useAuth } from '../AuthContext';



const API_KEY = "11194ae9f15c5c4c69f145c8b1a5a4be";
const SEARCH_API = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=`;
const GENRE_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

const Header = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const { user, logout } = useAuth(); 
    const navigate = useNavigate(); 
        const [isMenuOpen, setIsMenuOpen] = useState(false); 




    const searchRef = useRef(null);
    let debounceTimeout = useRef(null);

    // Fetch genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(GENRE_API);
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSearchResults = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setResults([]);
            setFilteredResults([]);
            setShowResults(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${SEARCH_API}${searchTerm}`);
            const data = await response.json();
            setResults(data.results);
            applyFilter(data.results, filter, selectedGenre);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

     const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(() => {
            fetchSearchResults(value);
        }, 500);
    };

    const applyFilter = (results, filterType, genre) => {
        let filtered = results;

        if (filterType === "movies") {
            filtered = filtered.filter((item) => item.media_type === "movie");
        } else if (filterType === "actors") {
            filtered = filtered.filter((item) => item.media_type === "person");
        } else if (filterType === "year") {
            filtered = filtered.filter((item) => item.release_date && item.release_date.startsWith(query));
        }

        if (genre !== "all") {
            filtered = filtered.filter((item) => item.genre_ids && item.genre_ids.includes(Number(genre)));
        }

        setFilteredResults(filtered);
    };

    useEffect(() => {
        applyFilter(results, filter, selectedGenre);
    }, [filter, selectedGenre, results]);


    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="header">
            <div className="header__left">
                {/* IMDb logo */}
                <Link to="/">
                    <img 
                        className="header__logo" 
                        src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" 
                        alt="IMDb Logo"
                    />
                </Link>
            </div>
            
              {/* Search Bar */}
            <div className="search-container" ref={searchRef}>
                <input
                    type="search"
                    placeholder="Search Movies..."
                    className="search-input"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setShowResults(true)}
                />
                {loading && <div className="loading-indicator">Loading...</div>}
                
                {/* Filter Dropdowns */}
                <div className="filter-container">
                    <select 
                        className="filter-dropdown"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="movies">Movies</option>
                        <option value="actors">Actors</option>
                        <option value="year">Year</option>
                    </select>

                    <select 
                        className="filter-dropdown"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="all">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                {showResults && filteredResults.length > 0 && (
                    <div className="search-results-overlay">
                        <div className="search-results">
                            {filteredResults.map((result) => (
                                <Link
                                    to={result.media_type === "person" ? `/actor/${result.id}` : `/movie/${result.id}`}
                                    key={result.id}
                                    className="search-result-item"
                                >
                                    <img
    src={
        result.media_type === "person"
            ? (result.profile_path ? `https://image.tmdb.org/t/p/w92${result.profile_path}` : "https://via.placeholder.com/92")
            : (result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : "https://via.placeholder.com/92")
    }
    alt={result.title || result.name}
    className="search-result-image"
/>

                                    <div className="search-result-info">
                                        <p className="search-result-title">{result.title || result.name}</p>
                                        {result.media_type === "movie" && result.release_date && (
                                            <p className="search-result-sub">({result.release_date.split("-")[0]})</p>
                                        )}
                                        {result.media_type === "person" && <p className="search-result-sub">Actor</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            

            {/* Navigation links */}
            <div className={`header__right ${isMenuOpen ? "mobileMenuOpen" : ""}`}>
                <Link to="/movies/popular" className="header__link">Movies</Link>
               <Link to="/movies/top_rated" className="header__link">Top Rated</Link>
                <Link to="/movies/upcoming" className="header__link">Coming Soon</Link>


                {user ? (
    <>
      <div className="header__profile">
        <Link to="/profile">
          <img 
            className="header__profileIcon" 
            src="https://freesvg.org/img/abstract-user-flat-3.png" 
            alt="User Profile"
          />
        </Link>
        <span>{user.username}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="header__link login-button">Login</Link>
                )}
            </div>

            {/* Hamburger Menu (for mobile) */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Header;
