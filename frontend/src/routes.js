export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CUSTOMER_DASHBOARD: "/customer/dashboard",
  CUSTOMER_PARKING: "/customer/parking",
  CUSTOMER_BOOKINGS: "/customer/bookings",
  CUSTOMER_TRANSACTIONS: "/customer/transactions",
  CUSTOMER_PROFILE: "/customer/profile",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_SLOTS: "/admin/slots",
  ADMIN_AREAS: "/admin/areas",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_REPORTS: "/admin/reports",
};

export const getDashboardRoute = (role) =>
  role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD;
