import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaAddressBook,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaGenderless,
  FaClinicMedical,
  FaNotesMedical,
  FaAddressCard,
  FaRegAddressCard,
} from "react-icons/fa";
import { Blocks } from "react-loader-spinner";
import image from "../../assets/images/patient.jpeg";
import "./PatientHome.css";
import Loading from "../Loading/Loading";
import { userContext } from "../UserContext/UserContext";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userToken, setUserToken } = useContext(userContext);
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(
          "https://grackle-notable-hardly.ngrok-free.app/api/profile/",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response && err.response.status === 401) {
          // Token is invalid, redirect to login
          setUserToken(null);
          localStorage.removeItem("userToken");
        }
        setError(err);
        setLoading(false);
      }
    };

    if (userToken) {
      fetchPatientProfile();
    } else {
      setLoading(false);
      setError({ message: "No authentication token found" });
    }
  }, [userToken, setUserToken]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="error-container">
        <p className="error">Error fetching profile: {error.message}</p>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Patient Home</title>
        <meta name="description" content="easy care Patient Home" />
      </Helmet>
      <div className="profile-container">
        <div className="dashboard-header w-100">
          <img src={image} alt="Patient" className="profile-photo" />
          <div className="welcome-section text-start">
            <h1 className="profile-header text-start fw-bolder">
              Patient Dashboard
            </h1>
            {profile && (
              <p className="welcome-text fw-bolder">
                Welcome back, {profile.full_name}!
              </p>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/appointments" className="dashboard-card action-card">
            <div className="card-icon">📅</div>
            <h3>Book Appointment</h3>
            <p>Schedule your next visit with a doctor</p>
          </Link>

          <Link
            to="/patientCategoryDoctors"
            className="dashboard-card action-card"
          >
            <div className="card-icon">👨‍⚕️</div>
            <h3>Find Doctors</h3>
            <p>Browse our network of qualified physicians</p>
          </Link>

          <Link
            to="/patientCatigoryPharmacies"
            className="dashboard-card action-card"
          >
            <div className="card-icon">💊</div>
            <h3>Find Pharmacies</h3>
            <p>Locate nearby pharmacies for your prescriptions</p>
          </Link>
        </div>

        {profile && (
          <div className="profile-section">
            <h2 className="section-title">Your Profile Information</h2>
            <div className="profile-cards">
              <div className="profile-card">
                {/* <FaUser className="profile-icon" /> */}
                <FaUser className="text-primary fs-3" />
                <p>
                  <strong>Full Name</strong>
                  <span className="value">{profile.full_name}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaRegAddressCard className="text-primary fs-3" />
                <p>
                  <strong>Address</strong>
                  <span className="value">{profile.address}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaBirthdayCake className="text-primary fs-3" />
                <p>
                  <strong>Birthday</strong>
                  <span className="value">{profile.birthday}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaPhone className="text-primary fs-3" />
                <p>
                  <strong>Phone Number</strong>
                  <span className="value">{profile.phone_number}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaEnvelope className="text-primary fs-3" />
                <p>
                  <strong>Email</strong>
                  <span className="value">{profile.email}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaGenderless className="text-primary fs-3" />
                <p>
                  <strong>Gender</strong>
                  <span className="value">{profile.gender}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaClinicMedical className="text-primary fs-3" />
                <p>
                  <strong>User Type</strong>
                  <span className="value">{profile.user_type}</span>
                </p>
              </div>
              <div className="profile-card">
                <FaNotesMedical className="text-primary fs-3" />
                <p>
                  <strong>Diabetes</strong>
                  <span className="value">
                    {profile.diabetes ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              <div className="profile-card">
                <FaNotesMedical className="text-primary fs-3" />
                <p>
                  <strong>Heart Disease</strong>
                  <span className="value">
                    {profile.heart_disease ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              <div className="profile-card">
                <FaNotesMedical className="text-primary fs-3" />
                <p>
                  <strong>Allergies</strong>
                  <span className="value">
                    {Array.isArray(profile.allergies)
                      ? profile.allergies.length > 0
                        ? profile.allergies.join(", ")
                        : "None"
                      : profile.allergies
                      ? profile.allergies
                      : "None"}
                  </span>
                </p>
              </div>
              <div className="profile-card">
                <FaNotesMedical className="text-primary fs-3" />
                <p>
                  <strong>Other Diseases</strong>
                  <span className="value">
                    {profile.other_diseases || "None"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
