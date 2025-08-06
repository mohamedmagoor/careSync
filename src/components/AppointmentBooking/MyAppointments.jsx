import { useState, useEffect, useCallback } from "react";
import "./MyAppointments.css";

const MyAppointments = ({ userToken, onBookNew, setError, setLoading }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/appointments/my-appointments/",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError("Failed to load appointments. Please try again.");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [userToken, setError, setLoading]);

  const filterAndSortAppointments = useCallback(() => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    // Sort appointments
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "date":
          valueA = new Date(`${a.appointment_date}T${a.appointment_time}`);
          valueB = new Date(`${b.appointment_date}T${b.appointment_time}`);
          break;
        case "doctor":
          valueA = a.doctor_name.toLowerCase();
          valueB = b.doctor_name.toLowerCase();
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    filterAndSortAppointments();
  }, [filterAndSortAppointments]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/appointments/appointments/${appointmentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel appointment");
      }

      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      setError(
        error.message || "Failed to cancel appointment. Please try again."
      );
      console.error("Error cancelling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      cancelled: "status-cancelled",
      completed: "status-completed",
    };

    const statusIcons = {
      pending: "⏳",
      confirmed: "✅",
      cancelled: "❌",
      completed: "✓",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        <span className="status-icon">{statusIcons[status]}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isUpcoming = (appointmentDate, appointmentTime) => {
    const appointmentDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`
    );
    return appointmentDateTime > new Date();
  };

  const statusCounts = appointments.reduce((counts, appointment) => {
    counts[appointment.status] = (counts[appointment.status] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="my-appointments">
      <div className="appointments-header">
        <div className="header-content">
          <h2>My Appointments</h2>
          <button onClick={onBookNew} className="book-new-btn">
            + Book New Appointment
          </button>
        </div>

        <div className="appointments-stats">
          <div className="stat-item">
            <span className="stat-number">{appointments.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts.confirmed || 0}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{statusCounts.completed || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="appointments-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date & Time</option>
            <option value="doctor">Doctor Name</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-order">Order:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appointments-icon">📅</div>
            <h3>No appointments found</h3>
            <p>
              {appointments.length === 0
                ? "You haven't booked any appointments yet."
                : "No appointments match your current filters."}
            </p>
            {appointments.length === 0 && (
              <button
                onClick={onBookNew}
                className="btn btn-primary booking-button"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`appointment-card ${appointment.status} ${
                isUpcoming(
                  appointment.appointment_date,
                  appointment.appointment_time
                )
                  ? "upcoming"
                  : "past"
              }`}
            >
              <div className="appointment-header">
                <div className="doctor-info">
                  <h3>Dr. {appointment.doctor_name}</h3>
                  {appointment.doctor_specialization && (
                    <p className="specialization">
                      {appointment.doctor_specialization}
                    </p>
                  )}
                </div>
                <div className="appointment-status">
                  {getStatusBadge(appointment.status)}
                </div>
              </div>

              <div className="appointment-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <span>{formatTime(appointment.appointment_time)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>
                    Created on{" "}
                    {new Date(appointment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {appointment.notes && (
                <div className="appointment-notes">
                  <h4>Your Notes:</h4>
                  <p>{appointment.notes}</p>
                </div>
              )}

              {appointment.doctor_notes && (
                <div className="doctor-notes">
                  <h4>Doctor&apos;s Notes:</h4>
                  <p>{appointment.doctor_notes}</p>
                </div>
              )}

              <div className="appointment-actions">
                {appointment.can_cancel &&
                  appointment.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Appointment
                    </button>
                  )}

                {appointment.status === "completed" && (
                  <span className="completed-note">
                    ✓ Appointment completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAppointments.length > 0 && (
        <div className="results-count">
          Showing {filteredAppointments.length} of {appointments.length}{" "}
          appointments
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
