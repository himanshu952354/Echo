import React from "react";
import { Home, Phone, User, Headset, Settings } from "lucide-react";
import { useState, useLayoutEffect, useRef } from "react";

export default function Navbar({ active = "home", onNavigate = () => { } }) {
  const items = [
    { icon: <Home size={20} />, name: "home", label: "Home", id: 0, animation: "bounce-slow" },
    { icon: <Phone size={20} />, name: "call", label: "Call", id: 1, animation: "shake-slow" },
    { icon: <User size={20} />, name: "customer", label: "Users", id: 2, animation: "pulse-slow" },
    { icon: <Headset size={20} />, name: "customercare", label: "Support", id: 3, animation: "wiggle-slow" },
    { icon: <Settings size={20} />, name: "settings", label: "Settings", id: 4, animation: "spin" },
  ];

  const [ballY, setBallY] = useState(0);
  const buttonsRef = useRef([]);
  const activeIndex = items.findIndex(item => item.name === active);

  useLayoutEffect(() => {
    if (window.innerWidth > 768) {
      const activeButtonEl = buttonsRef.current[activeIndex];
      if (activeButtonEl) {
        setBallY(activeButtonEl.offsetTop);
      }
    }
  }, [activeIndex]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="desktop-nav fixed left-0 w-20 bg-white/30 backdrop-blur-lg hidden lg:flex flex-col items-center py-6 border-r border-gray-200"
        style={{ top: 'var(--header-height)', height: 'calc(100vh - var(--header-height))' }}
      >
        <div className="relative w-full flex flex-col items-center gap-4">
          <div
            className="absolute bg-purple-600 w-12 h-12 rounded-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateY(${ballY}px)`,
              boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.5)'
            }}
          />
          {items.map((item, index) => (
            <button
              key={item.name}
              ref={el => (buttonsRef.current[index] = el)}
              onClick={() => onNavigate(item.name)}
              className={`nav-button w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none z-10 ${item.name}
                ${active === item.name
                  ? "text-white"
                  : "text-purple-700 hover:text-purple-800"
                }`}
            >
              {React.cloneElement(item.icon, {
                className: `icon ${active === item.name ? `animate-${item.animation}` : ''}`
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="mobile-nav lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className={`flex flex-col items-center justify-center text-xs w-full h-full
              ${active === item.name
                ? "text-purple-600"
                : "text-gray-500"
              }`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}