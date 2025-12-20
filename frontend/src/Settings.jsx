import React, { useState, useEffect } from 'react';
import { User, Bell } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import animationData from "../src/assets/animations/Settings.json";

const Settings = ({ user }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user || !user._id) {
      toast.error('User ID not found. Please log in again.');
      return;
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/${user._id}`, userData);
      toast.success('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">⚙️Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User size={20} className="mr-2" /> Profile
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-purple-700 text-white !rounded-full font-semibold rounded-lg hover:bg-purple-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bell size={20} className="mr-2" /> Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-xs text-gray-500">Receive email notifications for analysis results.</p>
                  </div>
                  <label htmlFor="email-notifications-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" id="email-notifications-toggle" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Push Notifications</h3>
                    <p className="text-xs text-gray-500">Get push notifications on your device.</p>
                  </div>
                  <label htmlFor="push-notifications-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" id="push-notifications-toggle" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
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

export default Settings;