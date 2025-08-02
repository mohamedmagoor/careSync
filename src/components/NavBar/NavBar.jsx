import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
            <span className="brand-text">{t("navbar.brand", "CareSync")}</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-nav d-flex flex-row">
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
                      {t("navbar.bookAppointment", "Book Appointment")}
                    </NavLink>
                    <NavLink
                      to="/patientCategoryDoctors"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">👨‍⚕️</span>
                      {t("navbar.allDoctors", "All Doctors")}
                    </NavLink>
                    <NavLink
                      to="/patientCatigoryPharmacies"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">💊</span>
                      {t("navbar.allPharmacies", "All Pharmacies")}
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-nav" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="nav-icon">📞</span>
                      {t("navbar.contact", "Contact us")}
                    </NavLink>
                  </div>
                )}
                {userType === "doctor" && (
                  <>
                    <div className="doctor-nav-section">
                      <NavLink
                        to="/doctor/appointments"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-nav" : ""}`
                        }
                        onClick={closeMenu}
                      >
                        {t("navbar.doctorAppointments", "Appointments")}
                      </NavLink>
                      <NavLink
                        to="/doctor/availability"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-nav" : ""}`
                        }
                        onClick={closeMenu}
                      >
                        {t("navbar.manageAvailability", "Manage Availability")}
                      </NavLink>
                      <NavLink
                        to="/doctorHome"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-nav" : ""}`
                        }
                        onClick={closeMenu}
                      >
                        {t(
                          "navbar.addPrescription",
                          "Add Patient Prescription"
                        )}
                      </NavLink>
                      <NavLink
                        to="/DoctorShowHistory"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-nav" : ""}`
                        }
                        onClick={closeMenu}
                      >
                        {t("navbar.showHistory", "Show Patient History")}
                      </NavLink>
                    </div>
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
                    {t("navbar.managePharmacy", "Manage Pharmacy")}
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
                    <span className="user-type-badge">
                      {t("navbar.userType." + userType, userType)}
                    </span>
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
                  {t("navbar.logout", "Logout")}
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <Link
                  to="/role"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  {t("navbar.joinUs", "JOIN US")}
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={closeMenu}
                >
                  {t("navbar.login", "Login")}
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
