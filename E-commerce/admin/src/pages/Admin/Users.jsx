import { useState } from "react";
import { FaUserShield, FaUserTimes, FaUserCheck } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Arun Kumar", email: "arun@example.com", role: "Customer", status: "Active", joined: "2026-01-10" },
    { id: 2, name: "Divya", email: "divya@example.com", role: "Customer", status: "Active", joined: "2026-02-14" },
    { id: 3, name: "Manoj", email: "manoj@example.com", role: "Customer", status: "Blocked", joined: "2026-03-05" },
    { id: 4, name: "Admin", email: "admin@shopper.com", role: "Admin", status: "Active", joined: "2025-11-20" },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id && user.role !== 'Admin') {
        return { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return user;
    }));
  };

  return (
    <div className="ml-16 md:ml-64 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.role === 'Admin' ? (
                      <span className="flex items-center gap-1 text-red-600 font-semibold"><FaUserShield/> Admin</span>
                    ) : (
                      <span className="text-gray-600">Customer</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.role !== 'Admin' && (
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={`text-sm px-3 py-1 border rounded-md transition-colors ${
                          user.status === 'Active' 
                            ? 'border-red-500 text-red-500 hover:bg-red-50' 
                            : 'border-green-500 text-green-500 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'Active' ? <span className="flex items-center gap-1"><FaUserTimes/> Block</span> : <span className="flex items-center gap-1"><FaUserCheck/> Unblock</span>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
