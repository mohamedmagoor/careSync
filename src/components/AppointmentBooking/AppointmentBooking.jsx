import { useState, useContext } from "react";
import { userContext } from "../UserContext/UserContext";
import DoctorList from "./DoctorList";
import DoctorSchedule from "./DoctorSchedule";
import BookingForm from "./BookingForm";
import MyAppointments from "./MyAppointments";
import "./AppointmentBooking.css";

const AppointmentBooking = () => {
  const { userToken } = useContext(userContext);
  const [currentStep, setCurrentStep] = useState("doctors"); // doctors, schedule, booking, myAppointments
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const steps = [
    { key: "doctors", label: "Select Doctor", icon: "👨‍⚕️" },
    { key: "schedule", label: "Choose Time", icon: "📅" },
    { key: "booking", label: "Book Appointment", icon: "✅" },
    { key: "myAppointments", label: "My Appointments", icon: "📋" },
  ];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep("schedule");
    setError("");
  };

  const handleSlotSelect = (slot, date) => {
    setSelectedSlot({ ...slot, date });
    setCurrentStep("booking");
    setError("");
  };

  const handleBookingComplete = () => {
    setSuccess("Appointment booked successfully!");
    setCurrentStep("myAppointments");
    // Reset selections
    setSelectedDoctor(null);
    setSelectedSlot(null);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setCurrentStep("doctors");
    setError("");
    setSuccess("");
  };

  return (
    <div className="appointment-booking">
      <div className="booking-header">
        <h1>Book an Appointment</h1>
        <div className="step-indicator">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`step ${currentStep === step.key ? "active" : ""} ${
                steps.findIndex((s) => s.key === currentStep) > index
                  ? "completed"
                  : ""
              }`}
              onClick={() => {
                if (step.key === "myAppointments") {
                  setCurrentStep("myAppointments");
                } else if (step.key === "doctors") {
                  resetBooking();
                }
              }}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
          <button onClick={() => setError("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
          <button onClick={() => setSuccess("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      <div className="booking-content">
        {currentStep === "doctors" && (
          <DoctorList
            onDoctorSelect={handleDoctorSelect}
            userToken={userToken}
            setError={setError}
            setLoading={setLoading}
          />
        )}

        {currentStep === "schedule" && selectedDoctor && (
          <DoctorSchedule
            doctor={selectedDoctor}
            onSlotSelect={handleSlotSelect}
            onBack={() => setCurrentStep("doctors")}
            userToken={userToken}
            setError={setError}
            setLoading={setLoading}
          />
        )}

        {currentStep === "booking" && selectedDoctor && selectedSlot && (
          <BookingForm
            doctor={selectedDoctor}
            slot={selectedSlot}
            onBookingComplete={handleBookingComplete}
            onBack={() => setCurrentStep("schedule")}
            userToken={userToken}
            setError={setError}
            setLoading={setLoading}
          />
        )}

        {currentStep === "myAppointments" && (
          <MyAppointments
            userToken={userToken}
            onBookNew={resetBooking}
            setError={setError}
            setLoading={setLoading}
          />
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
