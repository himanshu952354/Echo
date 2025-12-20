import React, { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import Lottie from "lottie-react";
import animationData from "../src/assets/animations/Support.json";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerCare = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/support`, formData);
      toast.success(response.data.msg);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to send message.');
    }
  };

  return (
    <main className="lg:ml-20 ml-0 min-h-screen bg-gray-50 p-8 pb-24 lg:pb-8 max-w-full overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 h-full" data-aos="fade-up">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your email"
                      required
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
                      className="px-6 py-2 bg-purple-700 text-white font-semibold !rounded-lg hover:bg-purple-800 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomerCare;