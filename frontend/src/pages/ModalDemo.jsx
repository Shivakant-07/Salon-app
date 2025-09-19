import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import ModalWrapper from "../components/common/ModalWrapper";
import ProfileModal from "../components/modals/ProfileModal";
import AdminDashboardModal from "../components/modals/AdminDashboardModal";
import ManageStaffModal from "../components/modals/ManageStaffModal";
import ManageServicesModal from "../components/modals/ManageServicesModal";
import BookingModal from "../components/modals/BookingModal";
import AuthModal from "../components/modals/AuthModal";

const ModalDemo = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [showManageStaff, setShowManageStaff] = useState(false);
    const [showManageServices, setShowManageServices] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
                        Modal System Demo
                    </h1>
                    <p className="text-center text-gray-600 mb-12">
                        All admin pages and profile now open as beautiful animated modals with background overlays
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Profile Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">👤</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Profile Modal</h3>
                                <p className="text-gray-600 mb-4">View and edit your profile information</p>
                                <button
                                    onClick={() => setShowProfile(true)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Open Profile
                                </button>
                            </div>
                        </div>

                        {/* Admin Dashboard Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                                <p className="text-gray-600 mb-4">View analytics and manage appointments</p>
                                <button
                                    onClick={() => setShowAdminDashboard(true)}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Open Dashboard
                                </button>
                            </div>
                        </div>

                        {/* Manage Staff Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Manage Staff</h3>
                                <p className="text-gray-600 mb-4">Add, edit, and manage staff members</p>
                                <button
                                    onClick={() => setShowManageStaff(true)}
                                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Manage Staff
                                </button>
                            </div>
                        </div>

                        {/* Manage Services Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">✂️</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Manage Services</h3>
                                <p className="text-gray-600 mb-4">Add and manage salon services</p>
                                <button
                                    onClick={() => setShowManageServices(true)}
                                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Manage Services
                                </button>
                            </div>
                        </div>

                        {/* Manage Appointments Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Manage Appointments</h3>
                                <p className="text-gray-600 mb-4">View and assign staff to appointments</p>

                            </div>
                        </div>

                        {/* Booking Modal */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Booking Modal</h3>
                                <p className="text-gray-600 mb-4">Create new appointments</p>
                                <button
                                    onClick={() => setShowBooking(true)}
                                    className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </div>

                        {/* Custom Modal Example */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚙️</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Custom Modal</h3>
                                <p className="text-gray-600 mb-4">Example of a custom modal</p>
                                <button
                                    onClick={() => setShowCustomModal(true)}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Open Custom Modal
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-center mb-8">Modal Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-green-600">✨ Animations</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Smooth fade-in/out animations</li>
                                    <li>• Slide-up modal entrance</li>
                                    <li>• Backdrop blur effect</li>
                                    <li>• Hover transitions on buttons</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-blue-600">🎨 Design</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Consistent styling across all modals</li>
                                    <li>• Responsive design for all screen sizes</li>
                                    <li>• Professional loading states</li>
                                    <li>• Clean, modern interface</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-purple-600">⚡ Functionality</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Click outside to close</li>
                                    <li>• ESC key support</li>
                                    <li>• Proper form validation</li>
                                    <li>• Real-time data updates</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-orange-600">🔧 Technical</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Reusable ModalWrapper component</li>
                                    <li>• Framer Motion animations</li>
                                    <li>• TypeScript-ready structure</li>
                                    <li>• Easy to maintain and extend</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Modals */}
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <AdminDashboardModal isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
            <ManageStaffModal isOpen={showManageStaff} onClose={() => setShowManageStaff(false)} />
            <ManageServicesModal isOpen={showManageServices} onClose={() => setShowManageServices(false)} />
            <BookingModal
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                role="admin"
                onAuthRequired={handleAuthRequired}
            />
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />

            {/* Custom Modal Example */}
            <ModalWrapper isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} title="Custom Modal Example" size="md">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Custom Modal</h3>
                    <p className="text-gray-600 mb-6">
                        This is an example of a custom modal using the ModalWrapper component.
                        You can easily create new modals by wrapping your content with ModalWrapper.
                    </p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">ModalWrapper Props:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• isOpen: boolean</li>
                                <li>• onClose: function</li>
                                <li>• title: string</li>
                                <li>• size: 'sm' | 'md' | 'lg' | 'xl' | 'full'</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setShowCustomModal(false)}
                            className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close Modal
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        </>
    );
};

export default ModalDemo;

