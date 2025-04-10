import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Link as LinkIcon, BarChart2, LogOut, Trash2, Edit, PlusCircle, User, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Link {
  id: string;
  original_url: string;
  short_code: string;
  title: string;
  clicks: number;
  created_at: string;
  expires_at?: string; // Add expires_at field
}

interface Analytics {
  date: string;
  clicks: number;
}

interface DeviceStat {
  device: string;
  count: number;
  percentage: number;
}

interface DailyStats {
  today: number;
  yesterday: number;
  weekly: number;
  dailyGrowth: string;
  weeklyAverage: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCustomAlias, setNewCustomAlias] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user, signOut } = useAuth();
  const navigate = useNavigate();

  // Data loading functions
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLinks(response.data);
    } catch (error) {
      toast.error('Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/chart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const fetchDeviceStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeviceStats(response.data.data.devices);
    } catch (error) {
      toast.error('Failed to fetch device statistics');
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/daily`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDailyStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch daily statistics');
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchLinks();
    fetchAnalytics();
    fetchDeviceStats();
    fetchDailyStats();
  }, []);

  // Handle form submissions
  const createShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload: any = { 
        longUrl: newUrl, 
        title: newTitle,
        customAlias: newCustomAlias
      };
      
      if (expiryTime) {
        payload.expiryTime = expiryTime;
      }
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/links/shorten`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Link created successfully!');
      setNewUrl('');
      setNewTitle('');
      setNewCustomAlias('');
      setExpiryTime('');
      setShowCreateForm(false);
      fetchLinks();
    } catch (error) {
      toast.error('Failed to create link');
    }
  };

  const updateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    try {
      const payload: any = {};
      if (newTitle) payload.title = newTitle;
      if (newCustomAlias) payload.customAlias = newCustomAlias;
      if (expiryTime) payload.expiryTime = expiryTime;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/links/${editingLink.id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Link updated successfully!');
      setNewTitle('');
      setNewCustomAlias('');
      setExpiryTime('');
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      toast.error('Failed to update link');
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/links/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Link deleted successfully!');
      fetchLinks();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleEditClick = (link: Link) => {
    setEditingLink(link);
    setNewTitle(link.title);
    setNewCustomAlias(link.short_code);
    setExpiryTime(link.expires_at || '');
    setShowCreateForm(false);
  };

  const resetForm = () => {
    setNewUrl('');
    setNewTitle('');
    setNewCustomAlias('');
    setExpiryTime('');
    setEditingLink(null);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Handle copying short URL to clipboard
  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${import.meta.env.VITE_API_URL}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LinkIcon className="w-8 h-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">ShrinkIQ</h1>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="mr-4 flex items-center">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {dailyStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Today's Clicks</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold">{dailyStats.today}</p>
                <p className={`ml-2 text-sm ${Number(dailyStats.dailyGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(dailyStats.dailyGrowth) >= 0 ? '↑' : '↓'} 
                  {Math.abs(Number(dailyStats.dailyGrowth))}%
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">vs. yesterday ({dailyStats.yesterday})</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Weekly Clicks</h3>
              <p className="mt-2 text-3xl font-semibold">{dailyStats.weekly}</p>
              <p className="mt-1 text-sm text-gray-500">Avg: {dailyStats.weeklyAverage} per day</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Links</h3>
              <p className="mt-2 text-3xl font-semibold">{links.length}</p>
              <p className="mt-1 text-sm text-gray-500">
                {links.reduce((total, link) => total + link.clicks, 0)} total clicks
              </p>
            </div>
          </div>
        )}

        {/* Link Creation Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {editingLink ? 'Edit Link' : (showCreateForm ? 'Create New Short Link' : 'Quick Actions')}
            </h2>
            <div>
              {!showCreateForm && !editingLink && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center text-sm px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Link
                </button>
              )}
              {(showCreateForm || editingLink) && (
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {showCreateForm && (
            <form onSubmit={createShortLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Alias</label>
                <input
                  type="text"
                  value={newCustomAlias}
                  onChange={(e) => setNewCustomAlias(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Short Link
              </button>
            </form>
          )}

          {editingLink && (
            <form onSubmit={updateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Original URL</label>
                <p className="mt-1 text-gray-500 break-all">{editingLink.original_url}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Alias</label>
                <input
                  type="text"
                  value={newCustomAlias}
                  onChange={(e) => setNewCustomAlias(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Link
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Charts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium">Click Analytics</h2>
              </div>
              <button 
                onClick={() => fetchAnalytics()}
                className="text-sm text-gray-500 flex items-center hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Device Breakdown</h2>
              <button 
                onClick={() => fetchDeviceStats()}
                className="text-sm text-gray-500 flex items-center hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
            {deviceStats.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="device"
                    >
                      {deviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} clicks`, props.payload.device]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No device data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Your Links</h2>
              <button 
                onClick={() => fetchLinks()}
                className="text-sm text-gray-500 flex items-center hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <p>Loading links...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{link.original_url}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-indigo-600 cursor-pointer" onClick={() => copyToClipboard(link.short_code)}>
                          {`${import.meta.env.VITE_API_URL}/${link.short_code}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(link)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't created any links yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 inline-flex items-center text-sm px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Link
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}