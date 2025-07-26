import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import "./NavBar.css";
import imageL from "../../assets/images/imageLogo.png";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";
import { FaUser } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function NavBar() {
  const { userToken, setUserToken } = useContext(userContext);
  const { userType, setUserType } = useContext(userContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let navigate = useNavigate();

  async function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    setUserToken(null);
    setUserType(null);
    navigate("/login");
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
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
    <nav className={`navbar-modern ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="brand-link" onClick={closeMenu}>
            <img
              src={imageL}
              alt="EasyCare Logo"
              className="brand-logo"
            />
            <span className="brand-text">CareSync</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {userToken !== null ? (
              <>
                {userType === "patient" && (
                  <>
                    <Link to="/patientCategoryDoctors" className="nav-link" onClick={closeMenu}>
                      All Doctors
                    </Link>
                    <Link to="/patientCatigoryPharmacies" className="nav-link" onClick={closeMenu}>
                      All Pharmacies
                    </Link>
                  </>
                )}
                {userType === "doctor" && (
                  <>
                    <Link to="/doctorHome" className="nav-link" onClick={closeMenu}>
                      Add Patient Prescription
                    </Link>
                    <Link to="/DoctorShowHistory" className="nav-link" onClick={closeMenu}>
                      Show Patient History
                    </Link>
                  </>
                )}
                <Link to="/contact" className="nav-link" onClick={closeMenu}>
                  Contact us
                </Link>
              </>
            ) : null}
          </div>

          <div className="navbar-actions">
            <div className="social-links">
              <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                <i className="fa-solid fa-brands fa-twitter"></i>
              </a>
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <i className="fa-solid fa-brands fa-facebook"></i>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <i className="fa-solid fa-brands fa-instagram"></i>
              </a>
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
