import React, { useContext, useState, useEffect } from "react";
<<<<<<< HEAD
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import "./NavBar.css";
import imageL from "../../assets/images/imageLogo.png";
import { Link, NavLink } from "react-router-dom";
=======
import { Link } from "react-router-dom";
>>>>>>> origin/Amer
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

<<<<<<< HEAD
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
=======
  // Close menu when clicking outside or on navigation links
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.navbar-menu');
      const toggle = document.querySelector('.navbar-toggle');
      
      if (isMenuOpen && menu && toggle && 
          !menu.contains(event.target) && 
          !toggle.contains(event.target)) {
>>>>>>> origin/Amer
        setIsMenuOpen(false);
      }
    };

<<<<<<< HEAD
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Enhanced logout function that uses context logout and navigates
  async function handleLogout() {
    try {
      logout(); // Use the context logout function
      closeMenu(); // Close mobile menu if open
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback logout
      localStorage.removeItem("userToken");
      localStorage.removeItem("userType");
      setUserToken(null);
      setUserType(null);
      navigate("/login");
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
=======
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

  const logout = async () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    setUserToken(null);
    setUserType(null);
    navigate("/login");
>>>>>>> origin/Amer
    setIsMenuOpen(false);
  };

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
<<<<<<< HEAD
          <Link to="/home" className="brand-link" onClick={closeMenu}>
            <img src={imageL} alt="EasyCare Logo" className="brand-logo" />
=======
          <Link to="/home" className="brand-link" onClick={() => setIsMenuOpen(false)}>
            <img
              src={imageL}
              alt="EasyCare Logo"
              className="brand-logo"
            />
>>>>>>> origin/Amer
            <span className="brand-text">CareSync</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-nav">
            {userToken && (
              <>
                {userType === "patient" && (
<<<<<<< HEAD
                  <div className="patient-nav-section">
                    <NavLink
                      to="/appointments"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">📅</span>
                      Book Appointment
                    </NavLink>
                    <NavLink
                      to="/patientCategoryDoctors"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">👨‍⚕️</span>
                      All Doctors
                    </NavLink>
                    <NavLink
                      to="/patientCatigoryPharmacies"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">💊</span>
=======
                  <>
                    <Link 
                      to="/patientCategoryDoctors" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Doctors
                    </Link>
                    <Link 
                      to="/patientCatigoryPharmacies" 
                      className="nav-link" 
                      onClick={() => setIsMenuOpen(false)}
                    >
>>>>>>> origin/Amer
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
                  </div>
                )}
                {userType === "doctor" && (
                  <>
<<<<<<< HEAD
                    <NavLink
                      to="/doctorHome"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      Add Patient Prescription
                    </NavLink>
                    <NavLink
                      to="/DoctorShowHistory"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
=======
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
>>>>>>> origin/Amer
                    >
                      Show Patient History
                    </NavLink>
                  </>
                )}
<<<<<<< HEAD
                {userType === "pharmacist" && (
                  <NavLink
                    to="/pharmacistHome"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-nav" : ""}`
                    }
                    onClick={closeMenu}
                  >
                    Manage Pharmacy
                  </NavLink>
                )}
=======
                <Link 
                  to="/contact" 
                  className="nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact us
                </Link>
>>>>>>> origin/Amer
              </>
            )}
          </div>

          <div className="navbar-actions">
            <div className="social-links">
<<<<<<< HEAD
              <a
                href="https://twitter.com"
                className="social-link"
                aria-label="Twitter"
              >
                <i className="fa-solid fa-brands fa-twitter"></i>
              </a>
              <a
                href="https://facebook.com"
                className="social-link"
                aria-label="Facebook"
              >
                <i className="fa-solid fa-brands fa-facebook"></i>
              </a>
              <a
                href="https://instagram.com"
                className="social-link"
                aria-label="Instagram"
              >
                <i className="fa-solid fa-brands fa-instagram"></i>
=======
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
              <a 
                href="https://instagram.com" 
                className="social-link instagram-link" 
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
>>>>>>> origin/Amer
              </a>
              <ThemeToggle />
            </div>

<<<<<<< HEAD
            {userToken !== null ? (
              <div className="user-actions">
                <div className="d-flex align-items-center gap-1">
                  <div className="user-info">
                    <span className="user-type-badge">{userType}</span>
                  </div>
                  <Link
                    to={profileLink}
                    className="profile-link"
                    aria-label="Profile"
                    onClick={closeMenu}
                  >
                    <FaUser size={18} />
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline logout-btn"
                >
                  <span className="logout-icon">🚪</span>
=======
            {userToken ? (
              <div className="user-actions">
                <Link 
                  to={profileLink} 
                  className="profile-link" 
                  aria-label="Profile" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser size={20} />
                </Link>
                <button 
                  onClick={logout} 
                  className="btn btn-outline"
                  aria-label="Logout"
                >
>>>>>>> origin/Amer
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-actions">
<<<<<<< HEAD
                <Link
                  to="/role"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  JOIN US
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={closeMenu}
=======
                <Link 
                  to="/role" 
                  className="btn btn-primary" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  JOIN US
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-outline" 
                  onClick={() => setIsMenuOpen(false)}
>>>>>>> origin/Amer
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
=======
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
>>>>>>> origin/Amer
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}