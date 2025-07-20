import React, { useState, useRef } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMapPin, FiUser, FiCalendar, FiClock, FiUpload, FiX } from 'react-icons/fi';

const SubmitCase = ({ user, setCases }) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    status: 'Missing',
    date: new Date().toISOString().split('T')[0],
    description: '',
    lastSeen: '',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setSubmitStatus({ type: 'error', message: 'Please upload an image file (JPEG, PNG)' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({ type: 'error', message: 'File size too large (max 5MB)' });
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate coordinates
    if (isNaN(formData.latitude)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid latitude' });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.longitude)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid longitude' });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      const newCase = {
        id: Date.now(),
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photoUrl: previewImage // In a real app, this would come from your backend
      };

      setCases((prev) => [...prev, newCase]);

      setIsSubmitting(false);
      setSubmitStatus({ type: 'success', message: 'Case submitted successfully!' });
      
      // Reset form but keep status and date defaults
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        status: 'Missing',
        date: new Date().toISOString().split('T')[0],
        description: '',
        lastSeen: '',
        photo: null
      });
      setPreviewImage(null);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-gray-50 p-6 rounded-lg">
        <FiAlertCircle className="text-yellow-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
        <p className="text-gray-600 text-center max-w-md">
          Please log in to submit a missing person case. This helps us maintain the integrity of our database.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Report a Missing Person</h2>
        <p className="text-gray-600">
          Provide details to help us locate the missing individual. All fields are required.
        </p>
      </div>

      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <FiCheckCircle className="text-xl mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <FiAlertCircle className="text-xl mr-3 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{submitStatus.message}</p>
            {submitStatus.type === 'success' && (
              <p className="text-sm mt-1 opacity-90">
                The case has been added to our database. Thank you for your contribution.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
              <FiUser className="mr-2" /> Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Status Field */}
          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 flex items-center">
              <FiClock className="mr-2" /> Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="Missing">Missing</option>
              <option value="Found">Found</option>
              <option value="Searching">Searching</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Field */}
          <div className="space-y-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 flex items-center">
              <FiCalendar className="mr-2" /> Date Last Seen
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Last Seen Location */}
          <div className="space-y-1">
            <label htmlFor="lastSeen" className="block text-sm font-medium text-gray-700 flex items-center">
              <FiMapPin className="mr-2" /> Last Seen Location
            </label>
            <input
              id="lastSeen"
              name="lastSeen"
              value={formData.lastSeen}
              onChange={handleChange}
              placeholder="Central Park, New York"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Coordinates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <div className="relative">
              <input
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                type="number"
                step="any"
                placeholder="e.g., 37.7749"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
              />
              <span className="absolute right-3 top-3.5 text-gray-400 text-sm">°N</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Decimal format (e.g., 40.7128)</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <div className="relative">
              <input
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                type="number"
                step="any"
                placeholder="e.g., -122.4194"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
              />
              <span className="absolute right-3 top-3.5 text-gray-400 text-sm">°W</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Decimal format (e.g., -74.0060)</p>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Physical description, clothing, circumstances..."
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Photo Upload Field - NEW SECTION */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Photo of Missing Person
          </label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="photo-upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <FiUpload className="mr-2" />
              Upload Photo
            </label>
            <input
              id="photo-upload"
              name="photo"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="sr-only"
            />
            <p className="ml-4 text-sm text-gray-500">
              {formData.photo ? formData.photo.name : 'No file chosen'}
            </p>
            {formData.photo && (
              <button
                type="button"
                onClick={removeImage}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            JPEG or PNG (Max 5MB). Helps with identification.
          </p>

          {/* Image Preview */}
          {previewImage && (
            <div className="mt-4">
              <div className="relative w-48 h-48 border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <FiX className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 flex justify-center items-center space-x-2 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FiCheckCircle className="text-lg" />
              <span>Submit Case</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-blue-800 font-medium mb-2 flex items-center">
          <FiAlertCircle className="mr-2" /> Important Notes
        </h3>
        <ul className="text-blue-700 text-sm space-y-1 list-disc pl-5">
          <li>Double-check all information before submitting</li>
          <li>Use decimal degrees format for coordinates (GPS preferred)</li>
          <li>Include as much detail as possible in the description</li>
          <li>All submissions are reviewed before being published</li>
          <li>Clear photos help significantly with identification</li>
        </ul>
      </div>
    </div>
  );
};

export default SubmitCase;