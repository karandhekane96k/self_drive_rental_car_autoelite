import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Fleet from "./pages/Fleet";
import AdminAddCar from "./pages/AdminAddCar";
import CarDetails from "./pages/CarDetails";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";

// Public Info Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Hub and Spoke Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageCars from "./pages/ManageCars";
import ManageBookings from "./pages/ManageBookings"; // <-- NEW: Imported our new component

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Premium Notification Configuration */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: '#111827', color: '#fff', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
        }} 
      />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* Protected User Routes */}
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/manage-cars" element={
            <ProtectedRoute requireAdmin={true}>
              <ManageCars />
            </ProtectedRoute>
          } />

          <Route path="/admin/add-car" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminAddCar />
            </ProtectedRoute>
          } />

          {/* <-- NEW: Updated the route to point to the new ManageBookings page --> */}
          <Route path="/admin/manage-bookings" element={
            <ProtectedRoute requireAdmin={true}>
              <ManageBookings />
            </ProtectedRoute>
          } />

          {/* 404 Catch-All Route (MUST BE LAST) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}