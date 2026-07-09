import { Routes, Route } from 'react-router-dom';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RegisterFlightOwner from '../pages/auth/RegisterFlightOwner';

// Common
import ProtectedRoute from '../components/common/ProtectedRoute';

// Passenger
import Home from '../pages/passenger/Home';
import SearchResults from '../pages/passenger/SearchResults';
import BookSeats from '../pages/passenger/BookSeats';
import BookingReview from '../pages/passenger/BookingReview';
import Payment from '../pages/passenger/Payment';
import MyTrips from '../pages/passenger/MyTrips';
import Profile from '../pages/passenger/Profile';

// Flight Owner
import OwnerDashboard from '../pages/flightOwner/Dashboard';
import AddFlight from '../pages/flightOwner/AddFlight';
import CreateSchedule from '../pages/flightOwner/CreateSchedule';
import MyFlights from '../pages/flightOwner/MyFlights';
import MyPassengers from '../pages/flightOwner/MyPassengers';

// Admin 
import AdminDashboard from '../pages/admin/Dashboard';
import AdminPassengers from '../pages/admin/Passengers';
import AdminFlightOwners from '../pages/admin/FlightOwners';
import AdminBookings from '../pages/admin/Bookings';
import AdminRoutes from '../pages/admin/Routes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-flightowner" element={<RegisterFlightOwner />} />
      <Route path="/book/:scheduleId/:cabinId" element={<BookSeats />} />

      {/* Passenger (protected) */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute allowedRoles={['Passenger']}><Home /></ProtectedRoute>}
      />
      <Route
        path="/booking-review"
        element={<ProtectedRoute allowedRoles={['Passenger']}><BookingReview /></ProtectedRoute>}
      />
      <Route
        path="/payment"
        element={<ProtectedRoute allowedRoles={['Passenger']}><Payment /></ProtectedRoute>}
      />
      <Route
        path="/my-trips"
        element={<ProtectedRoute allowedRoles={['Passenger']}><MyTrips /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute allowedRoles={['Passenger', 'FlightOwner', 'Admin']}><Profile /></ProtectedRoute>}
      />

      {/* Flight Owner (protected) */}
      <Route
        path="/owner/dashboard"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><OwnerDashboard /></ProtectedRoute>}
      />
      <Route
        path="/owner/add-flight"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><AddFlight /></ProtectedRoute>}
      />
      <Route
        path="/owner/create-schedule"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><CreateSchedule /></ProtectedRoute>}
      />
      <Route
        path="/owner/my-flights"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><MyFlights /></ProtectedRoute>}
      />
      <Route
        path="/owner/my-passengers"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><MyPassengers /></ProtectedRoute>}
      />
      <Route
        path="/owner/profile"
        element={<ProtectedRoute allowedRoles={['FlightOwner']}><Profile /></ProtectedRoute>}
      />

      {/* Admin (protected, stub) */}
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>}
      />
      <Route path="/admin/passengers" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPassengers /></ProtectedRoute>} />
      <Route path="/admin/flight-owners" element={<ProtectedRoute allowedRoles={['Admin']}><AdminFlightOwners /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['Admin']}><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/routes" element={<ProtectedRoute allowedRoles={['Admin']}><AdminRoutes /></ProtectedRoute>} />    

      {/* Fallback */}
      <Route path="/unauthorized" element={<div className="p-5 text-center">You don't have access to this page.</div>} />
      <Route path="*" element={<div className="p-5 text-center">Page not found.</div>} />
    </Routes>
  );
}