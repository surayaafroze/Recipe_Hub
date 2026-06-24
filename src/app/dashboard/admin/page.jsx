"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Loader from '@/components/shared/Loader';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState({ stats: null, users: [], recipes: [], reports: [], payments: [] });
  const [loading, setLoading] = useState(true);

  // Keep state synced with URL search parameter if it changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'users', 'recipes', 'reports', 'payments'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    const actionText = isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    const toastId = toast.loading(`${isBlocked ? 'Unblocking' : 'Blocking'} user...`);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isBlocked: !isBlocked })
      });
      if (res.ok) {
        toast.success(isBlocked ? 'User unblocked successfully! 🎉' : 'User blocked successfully! 🚫', { id: toastId });
        fetchData();
      } else {
        toast.error('Failed to update user status', { id: toastId });
      }
    } catch {
      toast.error('Network error updating user status', { id: toastId });
    }
  };

  const handleFeatureRecipe = async (recipeId, isFeatured) => {
    const toastId = toast.loading('Updating recipe feature status...');
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isFeatured: !isFeatured })
      });
      if (res.ok) {
        toast.success(isFeatured ? 'Recipe unfeatured successfully!' : 'Recipe featured successfully! ⭐', { id: toastId });
        fetchData();
      } else {
        toast.error('Failed to update feature status', { id: toastId });
      }
    } catch {
      toast.error('Network error updating feature status', { id: toastId });
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe? This action is permanent.')) return;
    const toastId = toast.loading('Deleting recipe...');
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Recipe deleted successfully! 🗑️', { id: toastId });
        fetchData();
      } else {
        toast.error('Failed to delete recipe', { id: toastId });
      }
    } catch {
      toast.error('Network error deleting recipe', { id: toastId });
    }
  };

  const handleReportStatus = async (reportId, status) => {
    const actionText = status === 'removed' ? 'remove the reported recipe' : 'dismiss this report';
    if (!confirm(`Are you sure you want to ${actionText}?`)) return;

    const toastId = toast.loading('Updating report status...');
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(status === 'removed' ? 'Report resolved and recipe removed! 🗑️' : 'Report dismissed successfully!', { id: toastId });
        fetchData();
      } else {
        toast.error('Failed to update report status', { id: toastId });
      }
    } catch {
      toast.error('Network error updating report status', { id: toastId });
    }
  };

  const tabs = ['overview', 'users', 'recipes', 'reports', 'payments'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-800 pb-6 lg:pb-0 lg:pr-6 min-h-0 lg:min-h-[70vh]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h2>
        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2.5 rounded-xl capitalize font-semibold transition whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800'
              }`}
            >
              {tab === 'payments' ? 'transactions' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <Loader size="md" text={`Loading ${activeTab === 'payments' ? 'transactions' : activeTab}...`} />
        ) : (
          <>
            {/* Overview Stats */}
            {activeTab === 'overview' && data.stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Users</h3>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">{data.stats.totalUsers}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Recipes</h3>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">{data.stats.totalRecipes}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold uppercase tracking-wider">Premium Members</h3>
                  <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400 mt-4">{data.stats.totalPremiumMembers}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-red-500 text-sm font-semibold uppercase tracking-wider">Total Reports</h3>
                  <div>
                    <p className="text-3xl font-extrabold text-red-500 mt-4">{data.stats.totalReports}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.stats.pendingReports} pending resolution</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <h3 className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</h3>
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mt-4">${data.stats.totalRevenue?.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              data.users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No users found.</div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Name</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Email</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Role / Plan</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map(u => (
                        <tr key={u.id || u._id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition">
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{u.name}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-50 text-red-700 dark:bg-red-900/20' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20'}`}>
                              {u.role || 'user'}
                            </span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${(u.isPremium || u.plan === 'premium') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800'}`}>
                              {(u.isPremium || u.plan === 'premium') ? 'Premium' : 'Free'}
                            </span>
                          </td>
                          <td className="p-4 text-sm">
                            {u.role !== 'admin' ? (
                              <button 
                                onClick={() => handleBlockUser(u.id || u._id, u.isBlocked)}
                                className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold cursor-pointer shadow-sm hover:shadow transition ${u.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                              >
                                {u.isBlocked ? '🔓 Unblock' : '🚫 Block'}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 font-semibold italic">System Admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Recipes Tab */}
            {activeTab === 'recipes' && (
              data.recipes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No recipes uploaded yet.</div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Recipe</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Author</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Status</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recipes.map(r => (
                        <tr key={r._id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition">
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-bold">{r.recipeName}</td>
                          <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{r.authorName} <br/><span className="text-xs text-gray-400">{r.authorEmail}</span></td>
                          <td className="p-4 text-sm">
                            {r.isFeatured ? (
                              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Featured ⭐</span>
                            ) : (
                              <span className="text-gray-400 dark:text-zinc-600 text-xs font-semibold">Standard</span>
                            )}
                          </td>
                          <td className="p-4 text-sm space-x-3">
                            <Link 
                              href={`/dashboard/edit-recipe/${r._id}`}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleFeatureRecipe(r._id, r.isFeatured)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold cursor-pointer"
                            >
                              {r.isFeatured ? 'Unfeature' : 'Feature'}
                            </button>
                            <button 
                              onClick={() => handleDeleteRecipe(r._id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              data.reports.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No reports submitted.</div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Recipe Details</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Reporter</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Reason</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Status</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.map(r => (
                        <tr key={r._id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition">
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                            <span className="font-bold">{r.recipeName}</span>
                            <br/><span className="text-xs text-gray-400 font-mono">ID: {r.recipeId}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{r.reporterEmail}</td>
                          <td className="p-4 text-sm text-red-600 dark:text-red-400 font-medium">{r.reason}</td>
                          <td className="p-4 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                              r.status === 'pending' 
                                ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400' 
                                : r.status === 'dismissed'
                                ? 'bg-gray-100 text-gray-600 dark:bg-zinc-800'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm space-x-3">
                            {r.status === 'pending' ? (
                              <>
                                <button onClick={() => handleReportStatus(r._id, 'dismissed')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-semibold cursor-pointer">Dismiss</button>
                                <button onClick={() => handleReportStatus(r._id, 'removed')} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer">Remove Recipe</button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400 italic font-semibold">Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Payments / Transactions Tab */}
            {activeTab === 'payments' && (
              data.payments.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center text-gray-500 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💳</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">There are no payment logs recorded in the payments collection yet.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">User</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Amount</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Status</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Date</th>
                        <th className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payments.map(p => (
                        <tr key={p._id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition">
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {p.userEmail}
                            <br/><span className="text-xs text-gray-400 font-mono">ID: {p.userId}</span>
                          </td>
                          <td className="p-4 text-sm text-green-600 dark:text-green-400 font-bold">${p.amount?.toFixed(2)}</td>
                          <td className="p-4 text-sm">
                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                              {p.paymentStatus || 'Paid'}
                            </span>
                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                              {p.type || 'Premium'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{new Date(p.paidAt).toLocaleDateString()}</td>
                          <td className="p-4 text-xs font-mono text-gray-500 dark:text-zinc-400">{p.transactionId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<Loader size="lg" text="Initialising Admin Dashboard..." />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
