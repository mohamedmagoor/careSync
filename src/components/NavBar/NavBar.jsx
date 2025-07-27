import React, { useContext, useState, useEffect } from "react";
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
  const { userToken, setUserToken, userType, setUserType, logout, isLoading } =
    useContext(userContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let navigate = useNavigate();

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

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
          <Link to="/home" className="brand-link" onClick={closeMenu}>
            <img src={imageL} alt="EasyCare Logo" className="brand-logo" />
            <span className="brand-text">CareSync</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-nav">
            {userToken !== null ? (
              <>
                {userType === "patient" && (
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
                    >
                      Show Patient History
                    </NavLink>
                  </>
                )}
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
              </>
            ) : null}
          </div>

          <div className="navbar-actions">
            <div className="social-links">
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
              </a>
              <ThemeToggle />
            </div>

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
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-actions">
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
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
