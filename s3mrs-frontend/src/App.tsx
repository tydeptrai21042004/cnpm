// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchRooms from "./pages/SearchRooms";
import MyBookings from "./pages/MyBookings";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";
import AdminRequests from "./pages/AdminRequests";
// ✨ new admin chat pages
import AdminChatUsers from "./pages/AdminChatUsers";
import AdminChatConversation from "./pages/AdminChatConversation";

import NotFound from "./pages/NotFound";
import AuthRoute from "./components/AuthRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* student routes */}
          <Route path="/rooms" element={<AuthRoute><SearchRooms /></AuthRoute>} />
          <Route path="/bookings" element={<AuthRoute><MyBookings /></AuthRoute>} />
          <Route path="/chat" element={<AuthRoute><Chat /></AuthRoute>} />

          {/* admin routes */}
          <Route path="/admin" element={<AuthRoute role="admin"><AdminDashboard /></AuthRoute>} />
          <Route path="/admin/rooms" element={<AuthRoute role="admin"><AdminRooms /></AuthRoute>} />
          <Route path="/admin/requests" element={<AuthRoute role="admin"><AdminRequests /></AuthRoute>} />
          <Route path="/admin/chat" element={<AuthRoute role="admin"><AdminChatUsers /></AuthRoute>} />
          <Route path="/admin/chat/:userId" element={<AuthRoute role="admin"><AdminChatConversation /></AuthRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
