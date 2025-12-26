import React, { useState, useEffect } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Home from "./Home";
import Settings from "./Settings";
import SentimentDashboard from "./SentimentDashboard";
import Login from "./Login";
import Customer from "./Customer";
import LandingPage from "./LandingPage";
import CustomerCare from "./CustomerCare";

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [answeredCalls, setAnsweredCalls] = useState(0);
  const [abandonedCalls, setAbandonedCalls] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [callerNameInput, setCallerNameInput] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  // Load authentication state and active page from localStorage on initial load
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedUser = localStorage.getItem("user");
    const savedPage = localStorage.getItem("activePage");

    if (savedAuth === "true" && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser._id) {
          setIsAuthenticated(true);
          setUser(parsedUser);
          // If there's a valid saved page, use it; otherwise, default to home
          if (savedPage && savedPage !== "landing" && savedPage !== "login") {
            setActivePage(savedPage);
          } else {
            setActivePage("home");
          }
        } else {
          // Clear invalid data
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          localStorage.removeItem("activePage");
          setActivePage("landing");
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("activePage");
        setActivePage("landing");
      }
    } else {
      setActivePage("landing");
    }
    setAuthChecking(false);
  }, []);

  // Save active page to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("activePage", activePage);
    }
  }, [activePage, isAuthenticated]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user || !user._id) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stats?userId=${user._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setAnsweredCalls(data.answeredCalls);
          setAbandonedCalls(data.abandonedCalls);
        }
      } catch (error) {
        console.error("Failed to fetch initial stats:", error);
      }
    };

    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated, user]);

  const handleAuthSuccess = (userData) => {
    const user = userData.user || userData;
    if (user && user._id) {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      setActivePage("home");
    } else {
      console.error("Auth success but user data is invalid:", userData);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("activePage");
    setActivePage("landing");
  };

  const handleAnalysisComplete = (result) => {
    setCurrentAnalysis(result);
    if (result.success) {
      setAnsweredCalls((prev) => prev + 1);
      // Clear inputs on success
      setCallerNameInput("");
      setAudioFile(null);
    } else {
      // Optimistically update UI
      setAbandonedCalls((prev) => prev + 1);

      // Log to backend
      if (user && user._id) {
        fetch(`${import.meta.env.VITE_API_URL}/log-abandoned`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }).catch(err => console.error("Failed to log abandoned call", err));
      }
    }
  };

  const handleGetStarted = () => {
    setActivePage("login");
  };

  const handleNavigate = (page) => {
    // Only allow navigation to authenticated pages if authenticated
    if (page === "login" || page === "landing" || isAuthenticated) {
      setActivePage(page);
    } else {
      setActivePage("login");
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />;
      case "login":
        return <Login onAuthSuccess={handleAuthSuccess} setActivePage={setActivePage} />;
      case "home":
        return <Home answeredCalls={answeredCalls} abandonedCalls={abandonedCalls} user={user} />;
      case "call":
        return (
          <SentimentDashboard
            user={user}
            onAnalysisComplete={handleAnalysisComplete}
            result={currentAnalysis}
            callerName={callerNameInput}
            onCallerNameChange={setCallerNameInput}
            file={audioFile}
            onFileChange={setAudioFile}
          />
        );
      case "customer":
        return <Customer user={user} />;
      case "customercare":
        return <CustomerCare user={user} />;
      case "settings":
        return <Settings user={user} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER - Always show on all pages */}
      <Header
        isAuthenticated={isAuthenticated}
        activePage={activePage}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      {/* NAVBAR - Only show when authenticated and not on landing/login */}
      {isAuthenticated && activePage !== "login" && activePage !== "landing" && (
        <Navbar active={activePage} onNavigate={handleNavigate} />
      )}

      {renderPage()}
    </>
  );
}