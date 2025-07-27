import { useState, useEffect, useCallback } from "react";
import "./DoctorSchedule.css";

const DoctorSchedule = ({
  doctor,
  onSlotSelect,
  onBack,
  userToken,
  setError,
  setLoading,
}) => {
  const [availability, setAvailability] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchAvailability = useCallback(
    async (startDate) => {
      setLoading(true);
      try {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Get 7 days

        const response = await fetch(
          `http://localhost:8000/api/appointments/doctors/${
            doctor.id
          }/availability/?start_date=${formatDate(
            startDate
          )}&end_date=${formatDate(endDate)}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", errorData);
          throw new Error(
            `Failed to fetch doctor availability: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setAvailability(data.availability || []);
      } catch (error) {
        const errorMessage = error.message.includes(
          "Failed to fetch doctor availability"
        )
          ? error.message
          : "Failed to load doctor availability. Please try again.";
        setError(errorMessage);
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    },
    [doctor.id, userToken, setError, setLoading]
  );

  useEffect(() => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    setCurrentWeekStart(startOfWeek);
    fetchAvailability(startOfWeek);
  }, [fetchAvailability]);

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
    fetchAvailability(newWeekStart);
  };

  const handleSlotClick = (slot, date) => {
    if (slot.is_available) {
      onSlotSelect(slot, date);
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  const isPast = (dateString) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString < today;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Doctors
        </button>
        <div className="doctor-info">
          <h2>Dr. {doctor.full_name}</h2>
          <p className="specialization">{doctor.specialization}</p>
          {doctor.hospital && <p className="hospital">🏥 {doctor.hospital}</p>}
          {doctor.clinic && <p className="clinic">🏢 {doctor.clinic}</p>}
        </div>
      </div>

      <div className="schedule-content">
        <div className="week-navigation">
          <button
            onClick={() => navigateWeek(-1)}
            className="nav-btn"
            disabled={isPast(
              formatDate(
                new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000)
              )
            )}
          >
            ← Previous Week
          </button>
          <h3>
            Week of{" "}
            {currentWeekStart.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <button onClick={() => navigateWeek(1)} className="nav-btn">
            Next Week →
          </button>
        </div>

        <div className="availability-grid">
          {availability.length === 0 ? (
            <div className="no-availability">
              <p>No availability data found for this week.</p>
            </div>
          ) : (
            availability.map((day, index) => (
              <div
                key={index}
                className={`day-card ${isPast(day.date) ? "past" : ""} ${
                  isToday(day.date) ? "today" : ""
                }`}
              >
                <div className="day-header">
                  <h4>{day.day_name}</h4>
                  <p className="date">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="day-content">
                  {!day.is_available ? (
                    <div className="unavailable">
                      <span className="unavailable-icon">❌</span>
                      <p>{day.reason_unavailable || "Not available"}</p>
                    </div>
                  ) : (
                    <>
                      {day.working_hours && (
                        <div className="working-hours">
                          <small>
                            Working hours: {formatTime(day.working_hours.start)}{" "}
                            - {formatTime(day.working_hours.end)}
                          </small>
                        </div>
                      )}

                      <div className="time-slots">
                        {day.slots && day.slots.length > 0 ? (
                          day.slots.map((slot, slotIndex) => (
                            <button
                              key={slotIndex}
                              className={`time-slot ${
                                slot.is_available ? "available" : "booked"
                              } ${isPast(day.date) ? "past" : ""}`}
                              onClick={() => handleSlotClick(slot, day.date)}
                              disabled={!slot.is_available || isPast(day.date)}
                            >
                              {formatTime(slot.time)}
                              {!slot.is_available && (
                                <span className="booked-indicator">Booked</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="no-slots">No time slots available</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-color booked"></span>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <span className="legend-color unavailable"></span>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
