import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ExternalLink, QrCode } from 'lucide-react';
import { fetchLinks } from '../store/slices/linksSlice';
import { RootState } from '../store/store';
import { QRCodeSVG } from 'qrcode.react';

export default function LinksTable() {
  const dispatch = useDispatch();
  const { links, isLoading } = useSelector((state: RootState) => state.links);

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-indigo-600"
                  >
                    <span className="truncate max-w-xs">{link.originalUrl}</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {new URL(link.shortUrl).pathname.slice(1)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(link.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      link.isExpired
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {link.isExpired ? 'Expired' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      const modal = document.createElement('div');
                      modal.innerHTML = `
                        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div class="bg-white p-4 rounded-lg">
                            <div class="flex justify-end">
                              <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">×</button>
                            </div>
                            ${QRCodeSVG({
                              value: link.shortUrl,
                              size: 256,
                            })}
                          </div>
                        </div>
                      `;
                      document.body.appendChild(modal);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}