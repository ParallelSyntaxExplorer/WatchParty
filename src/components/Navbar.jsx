import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, User, Home as HomeIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


const Navbar = ({ onSearchOpen, onProfileClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="WatchParty Logo" className="navbar-logo-img" />
          <h1 className="logo">WATCH<span>PARTY</span></h1>
        </Link>
      </div>

      <div className="nav-right">
        <div className="nav-menu">
          <Link to="/" className="menu-item active">
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>
        </div>

        <div className="nav-actions">
          <SearchIcon onClick={onSearchOpen} className="nav-icon" />
          <div className="user-profile" onClick={onProfileClick}>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="nav-avatar" />
            ) : (
              <User className="nav-icon" />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
          z-index: 1000;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
          transition: var(--transition-fast);
        }

        .navbar.scrolled {
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            height: clamp(60px, 8vh, 70px);
        }

        .nav-left { display: flex; align-items: center; }
        .logo-link { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        
        .navbar-logo-img { height: clamp(30px, 5vw, 40px); }
        .logo { 
            color: #e50914; 
            font-size: clamp(1.2rem, 4vw, 1.8rem); 
            font-weight: 900; 
            letter-spacing: -1px; 
            margin: 0;
            white-space: nowrap;
        }
        .logo span { color: white; }

        .nav-right { display: flex; align-items: center; gap: clamp(15px, 3vw, 40px); }
        .nav-menu { display: flex; align-items: center; gap: 20px; }
        
        .menu-item {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: 0.3s;
        }
        .menu-item:hover, .menu-item.active { color: white; }

        .nav-actions { display: flex; align-items: center; gap: clamp(15px, 3vw, 25px); }
        .nav-icon { 
            color: white; 
            cursor: pointer; 
            transition: 0.3s; 
            width: clamp(18px, 4vw, 22px);
            height: clamp(18px, 4vw, 22px);
        }
        .nav-icon:hover {
          transform: scale(1.1);
          color: var(--accent-color);
        }

        .nav-avatar {
            width: clamp(28px, 5vw, 32px);
            height: clamp(28px, 5vw, 32px);
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.1);
            cursor: pointer;
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 4%; }
        }

        @media (max-width: 600px) {
          .menu-item span { display: none; }
          .logo { font-size: 1.2rem; }
        }

        @media (max-width: 480px) {
            .nav-menu { display: none; } /* Hide Home text/icon on very small mobile for space */
            .nav-right { gap: 15px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
