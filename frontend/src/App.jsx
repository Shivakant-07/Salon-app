// frontend/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/customer/Services";
import Profile from "./pages/Profile";
import StaffList from "./pages/customer/Staff";
import ModalDemo from "./pages/ModalDemo";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reschedule from "./pages/Reschedule";

import StaffDashboard from "./pages/staff/StaffDashboardModal";
import StaffSchedule from "./pages/staff/Schedule";

import AdminDashboard from "./pages/admin/Dashboard";
import ManageServices from "./pages/admin/ManageServices";
import ManageStaff from "./pages/admin/ManageStaff";
import ManageAppointments from "./pages/admin/ManageAppointments";
import Reports from "./pages/admin/Reports";

import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/modal-demo" element={<ModalDemo />} />

            {/* Customer (Protected) */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reschedule/:id" element={<ProtectedRoute><Reschedule /></ProtectedRoute>} />

            {/* Staff (Protected with role) */}
            <Route path="/staff/dashboard" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/schedule" element={<ProtectedRoute roles={['staff']}><StaffSchedule /></ProtectedRoute>} />

            {/* Admin (Protected with role) */}
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute roles={['admin']}><ManageServices /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute roles={['admin']}><ManageStaff /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><ManageAppointments /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
        </Routes>
    );
}
