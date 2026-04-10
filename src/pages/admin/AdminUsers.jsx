import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${userId}`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">Users</h1>
          <p className="text-dark-600">Manage registered users</p>
        </motion.div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-dark-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center text-dark-900 font-semibold">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-dark-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dark-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user._id, e.target.value)}
                          className="px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
