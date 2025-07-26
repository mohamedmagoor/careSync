import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaAddressBook,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaGenderless,
  FaClinicMedical,
  FaHospital,
  FaStethoscope,
} from "react-icons/fa";
import "./DoctorProfile.css";
import image from "../../assets/images/doctor.jpeg";
import { useContext } from "react";
import { userContext } from "../UserContext/UserContext";
import Loading from "../Loading/Loading";
import { Helmet } from "react-helmet";

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  let { userToken } = useContext(userContext);

  useEffect(() => {
    const fetchProfile = async () => {
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
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProfile();
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
        <title>Doctor Home</title>
        <meta name="description" content="easy care Doctor Home" />
      </Helmet>
      <div className="profile-container">
        <img src={image} alt="Doctor image" className="profile-photo" />
        <h1 className="profile-header">Doctor Information</h1>
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
                <strong>Clinic:</strong> {profile.clinic}
              </p>
            </div>
            <div className="profile-card">
              <FaHospital className="profile-icon" />
              <p>
                <strong>Hospital:</strong> {profile.hospital}
              </p>
            </div>
            <div className="profile-card">
              <FaStethoscope className="profile-icon" />
              <p>
                <strong>Specialization: </strong> {profile.specialization}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
