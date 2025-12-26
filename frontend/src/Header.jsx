import React, { useState, useRef, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Lottie from "lottie-react";
import animationData from "./assets/Microphone record.json";
import { FaUserCircle, FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ isAuthenticated, activePage, user, onLogout, onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const handleProfileClick = (e) => {
    e.preventDefault();
    onNavigate('settings');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, notificationDropdownRef]);

  const isLogin = activePage === 'login';

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`transition-all duration-300 backdrop-blur-md z-50 ${isLogin
        ? 'bg-white/10 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
        : 'bg-white/70 border-gray-200/50 shadow-sm supports-[backdrop-filter]:bg-white/50'
        }`}
      style={{ height: '64px' }}
    >
      <Container fluid className="d-flex justify-content-between align-items-center px-3">
        <Navbar.Brand
          className="fs-4 d-flex align-items-center gap-0 cursor-pointer"
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer', padding: 0 }}
        >
          <Lottie
            animationData={animationData}
            style={{ width: 50, height: 50 }}
          />
          <span className="font-semibold text-lg   text-gray-900">Echo</span>
        </Navbar.Brand>

        {isAuthenticated ? (
          <div className="d-flex align-items-center gap-4">
            <div className="relative" ref={notificationDropdownRef}>
              <FaBell
                size={22}
                className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 text-gray-600"
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              />
              <AnimatePresence>
                {notificationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200 overflow-hidden"
                  >
                    <div className="py-1">
                      <a
                        href="#"
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150 ${isLogin ? 'text-gray-200 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <span>No new notifications</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative" ref={dropdownRef}>
              <div
                className="cursor-pointer d-flex align-items-center justify-content-center hover:opacity-80 transition-opacity"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                    alt="Profile"
                    className="rounded-full border border-gray-300 object-cover shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <FaUserCircle size={32} className="text-gray-600" />
                )}
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200 overflow-hidden"
                  >
                    <div className="py-1">
                      <a
                        href="#"
                        onClick={handleProfileClick}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 transition-colors duration-150 hover:bg-gray-100"
                        style={{ textDecoration: 'none' }}
                      >
                        <FaUser className="w-4 h-4 text-gray-500" />
                        <span>Profile</span>
                      </a>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-gray-100 text-left border-t border-gray-100"
                        style={{ textDecoration: 'none', background: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          activePage !== 'login' && (
            <div className="d-flex align-items-center gap-3">
              <button
                className={`button ${isLogin ? '!bg-white/10 !text-white !border-white/20 hover:!bg-white/20' : ''}`}
                onClick={() => onNavigate ? onNavigate("login") : null}
              >
                <p className="m-0">{activePage === 'landing' ? 'Get Started' : 'Login'}</p>
              </button>
            </div>
          )
        )}
      </Container>
    </Navbar >
  );
}

export default Header;