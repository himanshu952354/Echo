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

  return (
    <Navbar expand="lg" fixed="top" className="bg-white border-b border-gray-200 shadow-sm" style={{ height: '64px' }}>
      <Container fluid className="d-flex justify-content-between align-items-center px-3">
        <Navbar.Brand
          className="fs-4 d-flex align-items-center cursor-pointer"
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer' }}
        >
          <Lottie
            animationData={animationData}
            style={{ width: 70, height: 70 }}
          />
          <span className="font-semibold">Echo</span>
        </Navbar.Brand>

        {isAuthenticated ? (
          <div className="d-flex align-items-center gap-3">
            <div className="relative" ref={notificationDropdownRef}>
              <FaBell
                size={22}
                className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
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
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 transition-colors duration-150"
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
              <div className="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-none d-md-block">{user?.username || "User"}</span>
                  <FaUserCircle size={22} />
                </div>
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
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 transition-colors duration-150"
                        style={{ textDecoration: 'none' }}
                      >
                        <FaUser className="w-4 h-4" />
                        <span>Profile</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="button d-flex align-items-center justify-content-center" onClick={onLogout} style={{ minWidth: "auto", padding: "8px 16px" }}>
              <FaSignOutAlt className="d-block d-md-none" />
              <p className="m-0 d-none d-md-block">Logout</p>
            </button>
          </div>
        ) : (
          activePage !== 'login' && (
            <div className="d-flex align-items-center gap-3">
              <button
                className="button"
                onClick={() => onNavigate ? onNavigate("login") : null}
              >
                <p className="m-0">{activePage === 'landing' ? 'Get Started' : 'Login'}</p>
              </button>
            </div>
          )
        )}
      </Container>
    </Navbar>
  );
}

export default Header;