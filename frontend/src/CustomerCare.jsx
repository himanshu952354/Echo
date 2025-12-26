import React, { useState, useEffect } from 'react';
import { LifeBuoy } from 'lucide-react';
import Lottie from "lottie-react";
import animationData from "../src/assets/animations/Support.json";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CustomerCare = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    message: '',
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Update form data when user prop becomes available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/support`, formData);
      toast.success(response.data.msg);
      // Reset only message, keep name/email
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="lg:ml-20 ml-0 min-h-[calc(100vh-64px)] bg-gray-50 p-8 pb-24 lg:pb-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-down">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">

            📩Support
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Have a question or need assistance? Fill out the form below, and our support team will get back to you as soon as possible.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/2">
            {/* Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 h-full" data-aos="fade-right" data-aos-delay="200">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-500 cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                      readOnly
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-purple-700 text-white font-semibold !rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center" data-aos="fade-left" data-aos-delay="400">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomerCare;