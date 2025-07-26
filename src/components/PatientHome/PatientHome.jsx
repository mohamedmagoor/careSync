import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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
        setError(err);
        setLoading(false);
      }
    };
    fetchPatientProfile();
  }, []);

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
        <img src={image} alt="Doctor" className="profile-photo" />
        <h1 className="profile-header">Patient Information</h1>
        {profile && (
          <div className="profile-cards">
            <div className="profile-card">
              <FaUser className="profile-icon" />
              <p>
                <strong>Full Name:</strong> {profile.full_name}
              </p>
            </div>
            <div className="profile-card">
              <FaAddressBook className="profile-icon" />
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
            </div>
            <div className="profile-card">
              <FaBirthdayCake className="profile-icon" />
              <p>
                <strong>Birthday:</strong> {profile.birthday}
              </p>
            </div>
            <div className="profile-card">
              <FaPhone className="profile-icon" />
              <p>
                <strong>Phone Number:</strong> {profile.phone_number}
              </p>
            </div>
            <div className="profile-card">
              <FaEnvelope className="profile-icon" />
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
            </div>
            <div className="profile-card">
              <FaGenderless className="profile-icon" />
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
            </div>
            <div className="profile-card">
              <FaClinicMedical className="profile-icon" />
              <p>
                <strong>User Type:</strong> {profile.user_type}
              </p>
            </div>
            <div className="profile-card">
              <FaNotesMedical className="profile-icon" />
              <p>
                <strong>Diabetes:</strong> {profile.diabetes ? "Yes" : "No"}
              </p>
            </div>
            <div className="profile-card">
              <FaNotesMedical className="profile-icon" />
              <p>
                <strong>Heart Disease:</strong>{" "}
                {profile.heart_disease ? "Yes" : "No"}
              </p>
            </div>
            <div className="profile-card">
              <FaNotesMedical className="profile-icon" />
              <p>
                <strong>Allergies:</strong>{" "}
                {Array.isArray(profile.allergies)
                  ? profile.allergies.length > 0
                    ? profile.allergies.join(", ")
                    : "None"
                  : profile.allergies
                  ? profile.allergies
                  : "None"}
              </p>
            </div>
            <div className="profile-card">
              <FaNotesMedical className="profile-icon" />
              <p>
                <strong>Other Diseases:</strong>{" "}
                {profile.other_diseases || "None"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
