import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";
import { FaUser } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./NavBar.css";
import imageL from "../../assets/images/imageLogo.png";

export default function NavBar() {
  const { userToken, setUserToken, userType, setUserType, logout, isLoading } =
    useContext(userContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close menu when clicking outside or on navigation links
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.navbar-menu');
      const toggle = document.querySelector('.navbar-toggle');
      
      if (isMenuOpen && menu && toggle && 
          !menu.contains(event.target) && 
          !toggle.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Lock scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);



  const profileLink =
    userType === "patient"
      ? "/patientHome"
      : userType === "doctor"
      ? "/doctorProfile"
      : userType === "pharmacist"
      ? "/pharmacistHome"
      : "/";

  return (
    <nav className={`navbar-modern ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="brand-link" onClick={() => setIsMenuOpen(false)}>
            <img
              src={imageL}
              alt="EasyCare Logo"
              className="brand-logo"
            />
            <span className="brand-text">CareSync</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-nav">
            {userToken && (
              <>
                {userType === "patient" && (
                  <>
                    <NavLink 
                      to="/patientCategoryDoctors" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Doctors
                    </NavLink>
                    <NavLink 
                      to="/patientCatigoryPharmacies" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Pharmacies
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">📞</span>
                      Contact us
                    </NavLink>
                  </>
                )}
                {userType === "doctor" && (
                  <>
                    <Link 
                      to="/doctorHome" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Patient Prescription
                    </Link>
                    <Link 
                      to="/DoctorShowHistory" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Show Patient History
                    </NavLink>
                  </>
                )}
                <Link 
                  to="/contact" 
                  className="nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact us
                </Link>
              </>
            )}
          </div>

          <div className="navbar-actions">
            <div className="social-links">
            <ThemeToggle />

              <a 
                href="https://twitter.com" 
                className="social-link"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a 
                href="https://facebook.com" 
                className="social-link" 
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <i className="fa-solid fa-brands fa-instagram"></i>
              </a>
              <ThemeToggle />
            </div>

            <ThemeToggle />

            {userToken !== null ? (
              <div className="user-actions">
                <Link to={profileLink} className="profile-link" aria-label="Profile" onClick={closeMenu}>
                  <FaUser size={20} />
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <Link to="/role" className="btn btn-primary" onClick={closeMenu}>
                  JOIN US
                </Link>
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}