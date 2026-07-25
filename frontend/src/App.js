import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter";
import { API_URL, AUTH_URL, authHeaders } from "./config/api";
import { ROUTES } from "./routes";

function App() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return { ...parsed, role: parsed.role || "customer" };
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleLogout = useCallback(async (redirect = true) => {
    try {
      if (token) {
        await axios.post(`${AUTH_URL}/logout`, {}, authHeaders(token));
      }
    } catch {
      // proceed with local logout even if API fails
    }
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (redirect) {
      window.location.href = ROUTES.LANDING;
    }
  }, [token]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          handleLogout(false);
          Swal.fire({
            title: "Session Expired",
            text: "Please sign in again.",
            icon: "warning",
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: "#0d9488",
          });
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [token, handleLogout]);

  const fetchAreas = async () => {
    try {
      const res = await axios.get(`${API_URL}/areas`);
      setAreas(res.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const fetchSlots = async (areaId) => {
    try {
      const res = await axios.get(`${API_URL}/areas/${areaId}/slots`);
      setSlots(res.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    fetchSlots(area._id);
  };

  const handleBookSlot = async () => {
    if (!user || !selectedSlot || !selectedArea) return;
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      await axios.post(
        `${API_URL}/book`,
        { slotId: selectedSlot._id, startTime, endTime },
        authHeaders(token)
      );

      Swal.fire({
        title: "Booking Confirmed!",
        text: `Slot ${selectedSlot.slotNumber} reserved at ${selectedArea.name}.`,
        icon: "success",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#0d9488",
      });

      fetchSlots(selectedArea._id);
      setSelectedSlot(null);
    } catch (error) {
      Swal.fire({
        title: "Booking Failed",
        text: error.response?.data?.message || "Unable to complete booking.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleLogin = (newToken, newUser) => {
    const normalizedUser = { ...newUser, role: newUser.role || "customer" };
    setToken(newToken);
    setUser(normalizedUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <AppRouter
        user={user}
        token={token}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogin={handleLogin}
        onLogout={() => handleLogout(true)}
        onProfileUpdate={handleProfileUpdate}
        areas={areas}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        handleAreaSelect={handleAreaSelect}
        slots={slots}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        handleBookSlot={handleBookSlot}
        fetchAreas={fetchAreas}
      />
    </Router>
  );
}

export default App;
