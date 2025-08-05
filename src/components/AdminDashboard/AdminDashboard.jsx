import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import Loading from "../Loading/Loading";
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("userToken");

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        "https://grackle-notable-hardly.ngrok-free.app/api/admin/users/",
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
    } catch (err) {
      setError(
        "Failed to fetch users. " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  }

  // Activate or reject user
  async function handleStatusChange(userId, status) {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    setError("");
    try {
      await axios.patch(
        `https://grackle-notable-hardly.ngrok-free.app/api/admin/account-status/${userId}/`,
        { account_status: status },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, account_status: status } : u
        )
      );
    } catch (err) {
      setError(
        "Failed to update status. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  }

  const pendingUsers = users.filter((u) => u.account_status === "pending");

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard - User Management</h2>
        <div className="dashboard-stats">
          <div className="stat-card total-users">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat-card pending-users">
            <span>Pending Approval</span>
            <strong>{pendingUsers.length}</strong>
          </div>
        </div>
      </div>

      {error && <div className="errorMessage">{error}</div>}

      {loading ? (
        <Loading />
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>National ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Status</th>
                <th>Face ID</th>
                <th>Back ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.national_id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-type-badge ${user.user_type}`}>
                      {user.user_type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.account_status}`}>
                      {user.account_status}
                    </span>
                  </td>
                  <td>
                    {user.face_id_image ? (
                      <a
                        href={user.face_id_image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="image-link"
                      >
                        View
                      </a>
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>
                    {user.back_id_image ? (
                      <a
                        href={user.back_id_image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="image-link"
                      >
                        View
                      </a>
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        disabled={actionLoading[user.id]}
                        onClick={() => handleStatusChange(user.id, "active")}
                        className="btn btn-success btn-sm"
                      >
                        {actionLoading[user.id] ? "Activating..." : "Activate"}
                      </button>
                      <button
                        disabled={actionLoading[user.id]}
                        onClick={() => handleStatusChange(user.id, "rejected")}
                        className="btn btn-danger btn-sm"
                      >
                        {actionLoading[user.id] ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingUsers.length === 0 && (
                <tr>
                  <td colSpan="9" className="no-users-message">
                    No pending users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
