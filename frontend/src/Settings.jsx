import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Settings = ({ user }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Account');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profilePicture: '',
    city: '',
    timezone: 'UTC/GMT -4 hours',
    dailyUtilization: 7,
    coreWorkRangeStart: 3,
    coreWorkRangeEnd: 6
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || '',
        email: user.email || '',
        profilePicture: user.profilePicture || '',
        city: user.city || '',
        timezone: user.timezone || 'UTC/GMT -4 hours',
        dailyUtilization: user.dailyUtilization || 7,
        coreWorkRangeStart: user.coreWorkRangeStart || 3,
        coreWorkRangeEnd: user.coreWorkRangeEnd || 6
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
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/user/${user._id}`, userData);
      toast.success('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Uploading...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${user._id}/profile-pic`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = response.data.user;
      setUserData((prev) => ({ ...prev, profilePicture: updatedUser.profilePicture }));

      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, profilePicture: updatedUser.profilePicture }));

      toast.update(toastId, { render: "Updated!", type: "success", isLoading: false, autoClose: 2000 });
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error("Upload failed", error);
      toast.update(toastId, { render: "Failed to upload", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleDeletePhoto = async () => {
    if (!user || !user._id) return;
    if (!confirm("Are you sure you want to remove your profile picture?")) return;

    try {
      // Update local state first for immediate feedback
      setUserData(prev => ({ ...prev, profilePicture: "" }));

      // Call API
      await axios.put(`${import.meta.env.VITE_API_URL}/user/${user._id}`, { ...userData, profilePicture: "" });

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, profilePicture: "" }));

      toast.success("Profile picture removed");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Failed to delete photo:", err);
      toast.error("Failed to remove photo");
    }
  };

  const PROFILE_PIC_URL = userData.profilePicture
    ? `${import.meta.env.VITE_API_URL}${userData.profilePicture}`
    : null;

  const tabs = ['Account', 'Notifications', 'Sharing', 'Update schedule', 'Billing', 'Questions'];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans lg:ml-20 overflow-x-hidden" style={{ scrollbarGutter: 'stable' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-6" data-aos="fade-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" data-aos="fade-right" data-aos-delay="100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-medium !rounded-full transition-colors outline-none ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-black'
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#7621de] !rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Content Area with Animation */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ACCOUNT SECTION */}
              {activeTab === 'Account' && (
                <>
                  {/* PROFILE ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-gray-100" data-aos="fade-up" data-aos-delay="200">
                    <div className="md:col-span-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile</h2>
                      <p className="text-sm text-gray-500">Set your account details</p>
                    </div>

                    <div className="md:col-span-8">
                      <div className="flex flex-col-reverse md:flex-row gap-8 items-start">

                        <div className="flex-1 w-full space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Username</label>
                              <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={userData.email}
                              onChange={handleInputChange}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                            />
                          </div>

                        </div>

                        {/* Photo Area */}
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-32 h-32 rounded-full bg-[#f3e6d8] overflow-hidden flex items-center justify-center relative group shadow-sm border border-gray-100">
                            {PROFILE_PIC_URL ? (
                              <img src={PROFILE_PIC_URL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-4xl">😎</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => fileInputRef.current.click()}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium !rounded-full hover:bg-gray-50 transition-colors"
                            >
                              Edit photo
                            </button>
                            <button
                              onClick={handleDeletePhoto}
                              className="p-1.5 bg-white border border-gray-200 text-gray-400 !rounded-full hover:text-red-500 hover:border-red-200 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TIMEZONE & PREFERENCES */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-gray-100" data-aos="fade-up" data-aos-delay="300">
                    <div className="md:col-span-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Timezone & preferences</h2>
                      <p className="text-sm text-gray-500">Let us know the time zone and format</p>
                    </div>
                    <div className="md:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="w-full">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={userData.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 scrollbar-hide"
                          />
                        </div>
                        <div className="w-full md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timezone</label>
                          <div className="relative">
                            <select
                              name="timezone"
                              value={userData.timezone}
                              onChange={handleInputChange}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none"
                            >
                              <option>UTC/GMT -4 hours</option>
                              <option>UTC/GMT -5 hours</option>
                              <option>UTC/GMT +1 hours</option>
                              <option>UTC/GMT +5:30 hours</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOTIVATION & PERFORMANCE */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12" data-aos="fade-up" data-aos-delay="400">
                    <div className="md:col-span-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Motivation & Performance</h2>
                      <p className="text-sm text-gray-500">Calibrate your desired activity levels</p>
                    </div>
                    <div className="md:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Utilization Slider */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <span className="text-sm font-medium text-gray-900">Desired daily utilization</span>
                            <span className="text-sm font-bold text-gray-900">{userData.dailyUtilization} hrs</span>
                          </div>
                          <input
                            type="range"
                            name="dailyUtilization"
                            min="1"
                            max="24"
                            value={userData.dailyUtilization}
                            onChange={handleInputChange}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7621de]"
                          />
                          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                            Find the perfect allocation that suits your workflow and maximizes your potential.
                          </p>
                        </div>

                        {/* Core Work Range Sliders */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <span className="text-sm font-medium text-gray-900">Core work range</span>
                            <span className="text-sm font-bold text-gray-900">{userData.coreWorkRangeStart} - {userData.coreWorkRangeEnd} hrs</span>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-8">Start</span>
                              <input
                                type="range"
                                name="coreWorkRangeStart"
                                min="0"
                                max="24"
                                value={userData.coreWorkRangeStart}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val < userData.coreWorkRangeEnd) handleInputChange(e);
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7621de]"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-8">End</span>
                              <input
                                type="range"
                                name="coreWorkRangeEnd"
                                min="0"
                                max="24"
                                value={userData.coreWorkRangeEnd}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val > userData.coreWorkRangeStart) handleInputChange(e);
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7621de]"
                              />
                            </div>
                          </div>
                          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                            Define the critical hours dedicated to your most important tasks for heightened focus.
                          </p>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={handleSaveChanges}
                          disabled={loading}
                          className="px-6 py-2.5 bg-[#7621de] text-white text-sm font-medium !rounded-full shadow hover:bg-[#601ab6] transition-colors disabled:opacity-70"
                        >
                          {loading ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* OTHER TABS PLACEHOLDER */}
              {activeTab !== 'Account' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">✨</div>
                  <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
                  <p className="text-gray-500 max-w-sm mt-2">The <strong>{activeTab}</strong> section is currently under development.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Settings;
