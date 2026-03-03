import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [roleFilter, searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Users fetch error:", err);
      showError("Failed to load users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/users/${deleteModal.user._id}`);
      showSuccess("User deleted successfully");
      setDeleteModal({ show: false, user: null });
      fetchUsers();
    } catch (err) {
      showError("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage all platform users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">All Roles</option>
              <option value="jobseeker">Job Seekers</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
            <button
              onClick={() => { setSearchTerm(""); setRoleFilter(""); }}
              className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
            >
              Clear Filters
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Showing <span className="font-semibold text-blue-600">{filteredUsers.length}</span> users
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm || roleFilter ? 'Try adjusting your filters' : 'No users registered yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">User</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">Joined</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{user.name || 'No Name'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{user.email || 'No Email'}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin" ? "bg-red-100 text-red-800" :
                          user.role === "recruiter" ? "bg-purple-100 text-purple-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {user.role === "recruiter" && (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.approved ? "Approved" : "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-4 py-4">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleteModal({ show: true, user })}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteModal.user?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteModal({ show: false, user: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
