import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./DoctorList.css";

const DoctorList = ({ onDoctorSelect, userToken, setError, setLoading }) => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/appointments/doctors/",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);

      // Extract unique specializations
      const uniqueSpecializations = [
        ...new Set(data.map((doctor) => doctor.specialization).filter(Boolean)),
      ];
      setSpecializations(uniqueSpecializations);
    } catch (error) {
      setError("Failed to load doctors. Please try again.");
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [userToken, setError, setLoading]);

  const filterDoctors = useCallback(() => {
    let filtered = doctors;

    if (selectedSpecialization) {
      filtered = filtered.filter((doctor) =>
        doctor.specialization
          ?.toLowerCase()
          .includes(selectedSpecialization.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.clinic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, selectedSpecialization, searchTerm]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  const handleDoctorSelect = (doctor) => {
    onDoctorSelect(doctor);
  };

  return (
    <div className="doctor-list">
      <div className="doctor-list-header">
        <h2>Choose Your Doctor</h2>
        <p>Select from our qualified healthcare professionals</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search Doctors:</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, specialization, hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="specialization">Specialization:</label>
          <select
            id="specialization"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="specialization-select"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`doctors-grid ${filteredDoctors.length === 0 ? "d-block" : ""}`}>
        {filteredDoctors.length === 0 ? (
          <div className="no-doctors">
            <div className="no-doctors-icon">👨‍⚕️</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="doctor-card"
              onClick={() => handleDoctorSelect(doctor)}
            >
              <div className="doctor-avatar">
                <div className="avatar-placeholder">
                  {doctor.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
              </div>

              <div className="doctor-info">
                <h3 className="doctor-name">Dr. {doctor.full_name}</h3>
                {doctor.specialization && (
                  <p className="doctor-specialization">
                    {doctor.specialization}
                  </p>
                )}

                <div className="doctor-details">
                  {doctor.hospital && (
                    <div className="detail-item">
                      <span className="detail-icon">🏥</span>
                      <span>{doctor.hospital}</span>
                    </div>
                  )}
                  {doctor.clinic && (
                    <div className="detail-item">
                      <span className="detail-icon">🏢</span>
                      <span>{doctor.clinic}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <span>{doctor.phone_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>

              <div className="doctor-actions">
                <button className="select-doctor-btn">
                  Select Doctor
                  <span className="btn-icon">→</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredDoctors.length > 0 && (
        <div className="results-count">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      )}
    </div>
  );
};

export default DoctorList;
