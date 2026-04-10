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
    <div className="min-h-screen bg-charcoal-300">
      <div className="bg-charcoal-200/50 border-b border-ivory-100/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-3 text-ivory-100">Users</h1>
            <p className="text-ivory-100/50 font-light mt-1">Manage registered users</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ivory-100/10">
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">User</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Email</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Role</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Joined</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100/5">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-charcoal-200/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gold-300/20 rounded-full flex items-center justify-center text-gold-300 font-serif text-lg">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-ivory-100 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">{user.email}</td>
                      <td className="px-6 py-5">
                        <span className={`badge ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user._id, e.target.value)}
                          className="px-4 py-2 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-lg text-sm focus:outline-none focus:border-gold-300 transition-colors"
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
