import React from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Link } from 'lucide-react';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import CreateLinkForm from '../components/CreateLinkForm';
import LinksTable from '../components/LinksTable';
import Analytics from '../components/Analytics';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                URL Shortener
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => dispatch(logout())}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <CreateLinkForm />
            <Analytics />
            <LinksTable />
          </div>
        </div>
      </main>
    </div>
  );
}