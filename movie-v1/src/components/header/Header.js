import "./Header.css";
import { useState } from "react";
import { FaHome, FaFilm, FaTv, FaFutbol, FaSearch, FaUserCircle, FaCompass } from "react-icons/fa";
import LoginModal from "../login/LoginModal";
import Search from "../search/Search";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <>
    <div className="glass-navbar">
      <div className="nav-left">
        <Link to="/" style={{textDecoration:'none', color:'inherit'}}>
          <div className={`nav-item ${location.pathname === '/' ? 'nav-active' : ''}`}>
            <FaHome className="nav-icon" /> <span>Home</span>
          </div>
        </Link>

        <Link to="/movies" style={{textDecoration:'none', color:'inherit'}}>
          <div className={`nav-item ${location.pathname === '/movies' ? 'nav-active' : ''}`}>
            <FaFilm className="nav-icon" /> <span>Movies</span>
          </div>
        </Link>

        <Link to="/tv" style={{textDecoration:'none', color:'inherit'}}>
          <div className={`nav-item ${location.pathname === '/tv' ? 'nav-active' : ''}`}>
            <FaTv className="nav-icon" /> <span>TV</span>
          </div>
        </Link>

        <Link to="/discover" style={{textDecoration:'none', color:'inherit'}}>
          <div className={`nav-item ${location.pathname === '/discover' ? 'nav-active' : ''}`}>
            <FaCompass className="nav-icon" /> <span>Discover</span>
          </div>
        </Link>
      </div>

      <div className="nav-right">
        <FaSearch className="icon" onClick={() => setIsSearchOpen(true)} />
        <FaUserCircle className="icon" onClick={() => setIsLoginOpen(true)} />
      </div>
    </div>
    
    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;