import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { Link, ExternalLink, Calendar } from "lucide-react";
import { createLink } from "../store/slices/linksSlice";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

export default function CreateLinkForm() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shortUrl, setShortUrl] = useState(""); // ✅ Added state for short URL
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        createLink({ url, alias, expiresAt })
      ).unwrap();
      setShortUrl(result.shortUrl); // ✅ Save result to shortUrl state
      toast.success("Link created successfully!");
    } catch (error) {
      toast.error("Failed to create link. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Short Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Long URL
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com/very-long-url"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom Alias (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="custom-alias"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiration Date (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Short Link
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your Short Link
          </h3>
          <div className="flex items-center space-x-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                toast.success("Copied to clipboard!");
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              📋
            </button>
          </div>
          <div className="mt-4">
            <QRCodeSVG value={shortUrl} size={128} />
          </div>
        </div>
      )}
    </div>
  );
}
