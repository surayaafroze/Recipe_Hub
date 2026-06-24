"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from '../../../lib/auth-client';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ stats: null, users: [], recipes: [], reports: [], payments: [] });
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const opts = { credentials: 'include' };

      if (activeTab === 'overview') {
        const res = await fetch('http://localhost:5000/api/admin/stats', opts);
        if (res.ok) {
          const stats = await res.json();
          setData(prev => ({ ...prev, stats }));
        }
      } else if (activeTab === 'users') {
        const res = await fetch('http://localhost:5000/api/admin/users', opts);
        if (res.ok) {
          const users = await res.json();
          setData(prev => ({ ...prev, users }));
        }
      } else if (activeTab === 'recipes') {
        const res = await fetch('http://localhost:5000/api/recipes?limit=50', opts);
        if (res.ok) {
           const { recipes } = await res.json();
           setData(prev => ({ ...prev, recipes }));
        }
      } else if (activeTab === 'reports') {
        const res = await fetch('http://localhost:5000/api/reports', opts);
        if (res.ok) {
          const reports = await res.json();
          setData(prev => ({ ...prev, reports }));
        }
      } else if (activeTab === 'payments') {
        const res = await fetch('http://localhost:5000/api/admin/payments', opts);
        if (res.ok) {
          const payments = await res.json();
          setData(prev => ({ ...prev, payments }));
        }
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isBlocked: !isBlocked })
    });
    if (res.ok) {
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      fetchData();
    }
  };

  const handleFeatureRecipe = async (recipeId, isFeatured) => {
    const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}/feature`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isFeatured: !isFeatured })
    });
    if (res.ok) {
      toast.success(isFeatured ? 'Recipe unfeatured' : 'Recipe featured');
      fetchData();
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm('Delete this recipe?')) return;
    const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      toast.success('Recipe deleted');
      fetchData();
    }
  };

  const handleReportStatus = async (reportId, status) => {
    const res = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      toast.success('Status updated');
      fetchData();
    }
  };

  const tabs = ['overview', 'users', 'recipes', 'reports', 'payments'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 pr-6 mr-6 min-h-[70vh]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-lg capitalize font-medium transition ${
                activeTab === tab 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-auto">
        {loading && <div className="text-gray-500">Loading {activeTab}...</div>}

        {!loading && activeTab === 'overview' && data.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.stats.totalUsers}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Total Recipes</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.stats.totalRecipes}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Pending Reports</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{data.stats.pendingReports}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">${data.stats.totalRevenue}</p>
            </div>
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <table className="w-full text-left bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Role / Plan</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{u.name}</td>
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{u.email}</td>
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{u.role} • {u.plan || 'Free'}</td>
                  <td className="p-4 text-sm">
                    <button 
                      onClick={() => handleBlockUser(u.id, u.isBlocked)}
                      className={`px-3 py-1 rounded text-white text-xs ${u.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && activeTab === 'recipes' && (
          <table className="w-full text-left bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Recipe</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Author</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recipes.map(r => (
                <tr key={r._id} className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{r.recipeName}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{r.authorName}</td>
                  <td className="p-4 text-sm">
                    {r.isFeatured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>}
                  </td>
                  <td className="p-4 text-sm space-x-2 flex">
                    <button 
                      onClick={() => handleFeatureRecipe(r._id, r.isFeatured)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {r.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button 
                      onClick={() => handleDeleteRecipe(r._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && activeTab === 'reports' && (
          <table className="w-full text-left bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Recipe ID</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Reporter</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Reason</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.reports.map(r => (
                <tr key={r._id} className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="p-4 text-xs text-gray-500 font-mono">{r.recipeId}</td>
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{r.reporterEmail}</td>
                  <td className="p-4 text-sm text-red-600 font-medium">{r.reason}</td>
                  <td className="p-4 text-sm text-gray-500 capitalize">{r.status}</td>
                  <td className="p-4 text-sm space-x-2">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleReportStatus(r._id, 'dismissed')} className="text-gray-500 hover:underline">Dismiss</button>
                        <button onClick={() => handleReportStatus(r._id, 'removed')} className="text-red-600 hover:underline">Remove</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && activeTab === 'payments' && (
          <table className="w-full text-left bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">User</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map(p => (
                <tr key={p._id} className="border-b border-gray-100 dark:border-zinc-800">
                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{p.userEmail}</td>
                  <td className="p-4 text-sm text-green-600 font-medium">${p.amount}</td>
                  <td className="p-4 text-sm capitalize text-gray-500">{p.paymentStatus}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(p.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
