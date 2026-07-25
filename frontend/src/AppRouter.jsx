import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES, getDashboardRoute } from "./routes";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import SecureRoute from "./components/SecureRoute";
import AdminRoute from "./components/AdminRoute";
import CustomerRoute from "./components/CustomerRoute";
import AdminShell from "./components/AdminShell";
import CustomerShell from "./components/CustomerShell";

import AdminDashboardView from "./components/AdminDashboardView";
import AdminUsersView from "./components/AdminUsersView";
import AdminSlotsView from "./components/AdminSlotsView";
import AdminAreasView from "./components/AdminAreasView";
import AdminBookingsView from "./components/AdminBookingsView";
import AdminTransactionsView from "./components/AdminTransactionsView";
import AdminReportsView from "./components/AdminReportsView";

import CustomerDashboardView from "./components/CustomerDashboardView";
import SearchSlotsView from "./components/SearchSlotsView";
import MyBookings from "./components/MyBookings";
import CustomerTransactionsView from "./components/CustomerTransactionsView";
import ProfileView from "./components/ProfileView";

const AppRouter = ({
  user,
  token,
  theme,
  toggleTheme,
  onLogin,
  onLogout,
  onProfileUpdate,
  areas,
  selectedArea,
  setSelectedArea,
  handleAreaSelect,
  slots,
  selectedSlot,
  setSelectedSlot,
  handleBookSlot,
  fetchAreas,
}) => {
  const PublicOnly = ({ children }) => {
    if (user) return <Navigate to={getDashboardRoute(user.role)} replace />;
    return children;
  };

  return (
    <Routes>
      <Route path={ROUTES.LANDING} element={<PublicOnly><LandingPage /></PublicOnly>} />
      <Route path={ROUTES.LOGIN} element={<PublicOnly><LoginPage onLogin={onLogin} /></PublicOnly>} />
      <Route path={ROUTES.REGISTER} element={<PublicOnly><RegisterPage onLogin={onLogin} /></PublicOnly>} />

      {/* Admin Routes */}
      <Route path={ROUTES.ADMIN_DASHBOARD} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminDashboardView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_USERS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminUsersView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_SLOTS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminSlotsView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_AREAS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminAreasView token={token} fetchAreas={fetchAreas} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_BOOKINGS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminBookingsView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_TRANSACTIONS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminTransactionsView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.ADMIN_REPORTS} element={
        <SecureRoute user={user}>
          <AdminRoute user={user}>
            <AdminShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <AdminReportsView token={token} />
            </AdminShell>
          </AdminRoute>
        </SecureRoute>
      } />

      {/* Customer Routes */}
      <Route path={ROUTES.CUSTOMER_DASHBOARD} element={
        <SecureRoute user={user}>
          <CustomerRoute user={user}>
            <CustomerShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <CustomerDashboardView user={user} token={token} />
            </CustomerShell>
          </CustomerRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.CUSTOMER_PARKING} element={
        <SecureRoute user={user}>
          <CustomerRoute user={user}>
            <CustomerShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <SearchSlotsView
                areas={areas}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                handleAreaSelect={handleAreaSelect}
                slots={slots}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                handleBookSlot={handleBookSlot}
              />
            </CustomerShell>
          </CustomerRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.CUSTOMER_BOOKINGS} element={
        <SecureRoute user={user}>
          <CustomerRoute user={user}>
            <CustomerShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <MyBookings token={token} />
            </CustomerShell>
          </CustomerRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.CUSTOMER_TRANSACTIONS} element={
        <SecureRoute user={user}>
          <CustomerRoute user={user}>
            <CustomerShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <CustomerTransactionsView token={token} />
            </CustomerShell>
          </CustomerRoute>
        </SecureRoute>
      } />
      <Route path={ROUTES.CUSTOMER_PROFILE} element={
        <SecureRoute user={user}>
          <CustomerRoute user={user}>
            <CustomerShell user={user} handleLogout={onLogout} theme={theme} toggleTheme={toggleTheme}>
              <ProfileView user={user} token={token} onProfileUpdate={onProfileUpdate} />
            </CustomerShell>
          </CustomerRoute>
        </SecureRoute>
      } />

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to={user ? getDashboardRoute(user.role) : ROUTES.LOGIN} replace />} />
      <Route path="/parking" element={<Navigate to={user?.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_PARKING} replace />} />
      <Route path="/bookings" element={<Navigate to={ROUTES.CUSTOMER_BOOKINGS} replace />} />
      <Route path="/profile" element={<Navigate to={ROUTES.CUSTOMER_PROFILE} replace />} />
      <Route path="/add-parking" element={<Navigate to={ROUTES.ADMIN_AREAS} replace />} />
      <Route path="/admin/users" element={<Navigate to={ROUTES.ADMIN_USERS} replace />} />
      <Route path="/admin/bookings" element={<Navigate to={ROUTES.ADMIN_BOOKINGS} replace />} />

      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
};

export default AppRouter;
