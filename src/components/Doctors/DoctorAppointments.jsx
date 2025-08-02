import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorAppointments.css';
import Loading from '../Loading/Loading';
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        'https://grackle-notable-hardly.ngrok-free.app/api/appointments/doctor/appointments/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      if (Array.isArray(response.data)) {
        // Sort appointments by date (newest first)
        const sortedAppointments = response.data.sort((a, b) => {
          const dateA = new Date(a.appointment_date + ' ' + a.appointment_time);
          const dateB = new Date(b.appointment_date + ' ' + b.appointment_time);
          return dateB - dateA; // Reverse sort (newest first)
        });
        setAppointments(sortedAppointments);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status, doctorNotes = '') => {
    try {
      const token = localStorage.getItem('userToken');
      console.log(`Updating appointment ${id} to status: ${status}`);
      
      const requestData = { status };
      if (doctorNotes) {
        requestData.doctor_notes = doctorNotes;
      }
      
      const response = await axios.patch(
        `https://grackle-notable-hardly.ngrok-free.app/api/appointments/appointments/${id}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Update response:', response.data);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Update error:', err);
      alert(`Failed to update status: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleCompleteAppointment = async (id) => {
    const notes = prompt('Enter doctor notes (optional):');
    if (notes !== null) { // User didn't cancel
      await updateAppointmentStatus(id, 'completed', notes);
    }
  };

  const handleNoShow = async (id) => {
    const notes = prompt('Enter reason for no-show (optional):');
    if (notes !== null) { // User didn't cancel
      await updateAppointmentStatus(id, 'cancelled', notes);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // British format: DD/MM/YYYY
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minute} ${suffix}`;
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    today: appointments.filter((a) => {
      const today = new Date().toISOString().slice(0, 10);
      return a.appointment_date === today;
    }).length,
  };

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="doctor-appointments-container">
      <div className="appointments-header">
        <h1>Doctor Appointments</h1>
        <p>Manage your upcoming and past appointments</p>
      </div>

      <div className="appointments-content">
        <div className="appointments-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>

        <div className="appointments-list">
          <h2>Appointment Details</h2>
          {appointments.length === 0 ? (
            <div className="no-appointments">
              <div className="no-appointments-icon">📅</div>
              <h3>No Appointments</h3>
              <p>There are no appointments available.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div className="appointment-card" key={apt.id}>
                <div className="appointment-header">
                  <div className="patient-info">
                    <div className="patient-name">{apt.patient_name}</div>
                    <div className="appointment-datetime">
                      {formatDate(apt.appointment_date)} at {formatTime(apt.appointment_time)}
                    </div>
                  </div>
                  <div className={`status-badge ${getStatusClass(apt.status)}`}>
                    {apt.status}
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-icon">👤</span>
                    <span className="detail-label">Patient:</span>
                    <span className="detail-value">{apt.patient_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(apt.appointment_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{formatTime(apt.appointment_time)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🏥</span>
                    <span className="detail-label">Specialization:</span>
                    <span className="detail-value">{apt.doctor_specialization}</span>
                  </div>
                </div>

                                 {(apt.notes || apt.doctor_notes) && (
                   <div className="appointment-notes">
                     {apt.notes && (
                       <div className="notes-section">
                         <div className="notes-label">
                           📝 Patient Notes
                         </div>
                         <div className="notes-content">{apt.notes}</div>
                       </div>
                     )}
                     
                     {apt.doctor_notes && (
                       <div className="notes-section">
                         <div className="notes-label">
                           👨‍⚕️ Doctor Notes
                         </div>
                         <div className="notes-content doctor-notes">{apt.doctor_notes}</div>
                       </div>
                     )}
                   </div>
                 )}

                                 {apt.status === 'pending' && (
                   <div className="appointment-actions">
                     <button
                       className="confirm-btn"
                       onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                     >
                       ✅ Confirm
                     </button>
                     <button
                       className="reject-btn"
                       onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                     >
                       ❌ Reject
                     </button>
                   </div>
                 )}

                 {apt.status === 'confirmed' && (
                   <div className="appointment-actions">
                     <button
                       className="complete-btn"
                       onClick={() => handleCompleteAppointment(apt.id)}
                     >
                       ✅ Complete
                     </button>
                     <button
                       className="no-show-btn"
                       onClick={() => handleNoShow(apt.id)}
                     >
                       ❌ No Show
                     </button>
                   </div>
                 )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
