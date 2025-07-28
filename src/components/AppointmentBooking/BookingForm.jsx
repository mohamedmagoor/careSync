import { useState } from "react";
import PropTypes from "prop-types";
import "./BookingForm.css";

const BookingForm = ({
  doctor,
  slot,
  onBookingComplete,
  onBack,
  userToken,
  setError,
  setLoading,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        doctor: doctor.id,
        appointment_date: slot.date,
        appointment_time: slot.time,
        notes: notes.trim(),
      };

      console.log('Sending appointment data:', appointmentData);

      const response = await fetch(
        "https://grackle-notable-hardly.ngrok-free.app/api/appointments/book/",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      const contentType = response.headers.get('content-type');
      
      // Handle HTML error responses (like 500 errors)
      if (contentType && contentType.includes('text/html')) {
        const errorText = await response.text();
        console.error('Server returned HTML error:', errorText);
        throw new Error('Server error occurred. Please try again.');
      }

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Server response error:', responseData);
        let errorMessage = responseData.detail || 
                         responseData.message || 
                         `Failed to book appointment (${response.status})`;
        
        // Handle field-specific validation errors
        if (responseData.non_field_errors) {
          errorMessage = responseData.non_field_errors.join(', ');
        }
        
        throw new Error(errorMessage);
      }

      console.log('Appointment booked successfully:', responseData);
      onBookingComplete();
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <div className="booking-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Schedule
        </button>
        <h2>Confirm Your Appointment</h2>
      </div>

      <div className="appointment-summary">
        <div className="summary-card">
          <h3>Appointment Details</h3>

          <div className="detail-row">
            <span className="detail-label">Doctor:</span>
            <span className="detail-value">
              <strong>Dr. {doctor.full_name}</strong>
              {doctor.specialization && (
                <span className="specialization">
                  {" "}
                  - {doctor.specialization}
                </span>
              )}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{formatDate(slot.date)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{formatTime(slot.time)}</span>
          </div>

          {doctor.hospital && (
            <div className="detail-row">
              <span className="detail-label">Hospital:</span>
              <span className="detail-value">{doctor.hospital}</span>
            </div>
          )}

          {doctor.clinic && (
            <div className="detail-row">
              <span className="detail-label">Clinic:</span>
              <span className="detail-value">{doctor.clinic}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">
              📞 {doctor.phone_number}
              <br />
              📧 {doctor.email}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form-content">
        <div className="form-group">
          <label htmlFor="notes">
            Notes for Doctor (Optional)
            <span className="label-description">
              Please describe your symptoms or reason for the visit
            </span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms, concerns, or reason for the visit..."
            rows="4"
            maxLength="500"
            className="notes-textarea"
          />
          <div className="character-count">{notes.length}/500 characters</div>
        </div>

        <div className="important-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <h4>Important Information</h4>
            <ul>
              <li>Please arrive 15 minutes before your appointment time</li>
              <li>Bring a valid ID and any relevant medical documents</li>
              <li>You can cancel your appointment up to 24 hours in advance</li>
              <li>A confirmation will be sent to your email and phone</li>
            </ul>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner small"></span>
                Booking...
              </>
            ) : (
              "Confirm Appointment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

BookingForm.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string.isRequired,
    specialization: PropTypes.string,
    hospital: PropTypes.string,
    clinic: PropTypes.string,
    phone_number: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  slot: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onBookingComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  userToken: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default BookingForm;