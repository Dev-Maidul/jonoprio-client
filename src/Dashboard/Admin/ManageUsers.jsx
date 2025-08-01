import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaDownload } from 'react-icons/fa'; // Icons for actions
import useAxiosSecure from '../../hooks/useAxiosSecure'; // Your custom Axios hook

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user
  const [modalVisible, setModalVisible] = useState(false); // State for controlling the modal visibility
  const axiosSecure = useAxiosSecure(); // Custom hook to handle secure API requests

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get('/admin/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  const handleViewUser = (userId) => {
    // Find the user from the users list and set it to the state
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
    setModalVisible(true); // Open the modal
  };

  const handleUpdateRole = (userId, newRole) => {
    // Call backend API to update user role
    axiosSecure
      .put(`/admin/user/role/${userId}`, { role: newRole })
      .then(() => {
        setUsers(users.map((user) => user._id === userId ? { ...user, role: newRole } : user));
      })
      .catch((error) => {
        console.error("Error updating user role", error);
      });
  };

  const handleSuspendActivateUser = (userId, status) => {
    // Call backend API to update user status (suspend or activate)
    axiosSecure
      .put(`/admin/user/status/${userId}`, { status })
      .then(() => {
        setUsers(users.map((user) => user._id === userId ? { ...user, status } : user));
      })
      .catch((error) => {
        console.error("Error updating user status", error);
      });
  };

  const handleDeleteUser = (userId) => {
    // Call backend API to delete user
    axiosSecure
      .delete(`/admin/user/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user", error);
      });
  };

  const handleExportUsers = () => {
    // Call backend API to export users data
    axiosSecure
      .get('/admin/users/export')
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users.csv';
        link.click();
      })
      .catch((error) => {
        console.error("Error exporting users data", error);
      });
  };

  const filteredUsers = users.filter(user => {
    if (statusFilter) {
      return user.status === statusFilter;
    }
    return true;
  });

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

      {/* Filter Users by Status */}
      <div className="mb-4">
        <label className="font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExportUsers}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <FaDownload /> Export Users
      </button>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <span>Loading Users...</span>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-ce">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button
                    onClick={() => handleViewUser(user._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => handleUpdateRole(user._id, user.role === "admin" ? "seller" : "admin")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FaEdit /> Change Role
                  </button>
                  <button
                    onClick={() => handleSuspendActivateUser(user._id, user.status === "active" ? "suspended" : "active")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal to view user details */}
      {modalVisible && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Account Created:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
            <p><strong>Last Logged In:</strong> {new Date(selectedUser.last_loggedIn).toLocaleString()}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
