// This is the shared layout used by every dashboard page across all roles. It has a sidebar on the left, live notifications, account settings options, and a main content area on the right.
import React, { useState, useEffect } from 'react'; // Import state and dynamic effect life cycle hooks.
// Import the useAuth custom helper hook from our AuthContext manager.
import { useAuth } from '../context/AuthContext'; // Load authentication context functionality.
// Import useNavigate navigation hooks from the standard react-router-dom packages.
import { useNavigate } from 'react-router-dom'; // Load react routing navigation.
// Import the custom Sidebar component from the components folder.
import Sidebar from './Sidebar'; // Resolve the sidebar navigation component.
// Import Axios preconfigured network client.
import api from '../utils/api'; // Load unified client-side network querying driver instances.
// Import lucide-react icons for visual representation
import { Bell, Settings, X, Shield, Mail, User, Lock, Upload, MessageSquare, Check, Sparkles } from 'lucide-react';

// Create a functional component called DashboardLayout representing the dashboard skeleton.
const DashboardLayout = ({ children, role, pageTitle }) => {
  const { user, logout, updateUser } = useAuth(); // Resolve context parameters.
  const navigate = useNavigate(); // Resolve useNavigate router capabilities.

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to load notifications list:', err);
    }
  };

  // Poll for notifications periodically
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // 15 seconds polling for immediate delivery feel
      return () => clearInterval(interval);
    }
  }, [user]);

  // Sync state when details change
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhotoPreview(user.profilePhoto || '');
    }
  }, [user]);

  const handleLogout = () => { // Initialize user logout subroutines.
    logout(); // Execute localStorage clear loops.
    navigate('/login'); // Move pointer location to /login.
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleNotificationClick = async (notif) => { // Define async function to handle notification clicks.
    try { // Start error handling block.
      if (!notif.isRead) { // Check if notification is unread.
        await api.put(`/notifications/${notif._id}/read`); // Mark notification as read via API call.
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)); // Update local state.
      } // Close unread check.
      setShowNotifications(false); // Close the notifications dropdown panel.
      if (notif.link) { // Check if notification has a navigation link using new schema field name.
        navigate(notif.link); // Navigate to the notification destination URL.
      } // Close link check.
    } catch (err) { // Catch any errors.
      console.error('Failed to handle notification click:', err); // Log error to console.
    } // Close try-catch block.
  }; // Close handleNotificationClick function.

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess('');
    setSettingsError('');

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      if (password.trim()) {
        formData.append('password', password);
      }
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }

      const response = await api.put('/auth/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSettingsSuccess('Profile updated successfully!');
      setPassword('');
      setProfilePhotoFile(null);
      
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      }

      setTimeout(() => {
        setSettingsSuccess('');
        setShowSettingsModal(false);
      }, 2000);
    } catch (err) {
      console.error('Settings submit error:', err);
      const msg = err.response?.data?.message || 'Failed to update settings. Please try again.';
      setSettingsError(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-[#faf8f5] overflow-hidden w-full relative">
      {/* Sidebar navigation deck passing role and active user information */}
      <Sidebar role={role} user={user} />
      
      {/* Main viewport slot containing top action bars and dynamic content views */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top dashboard action bar for headings and session controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-xs select-none">
          {/* Centered left side heading displaying the page title */}
          <h1 className="text-lg font-serif font-black text-[#1a202c] tracking-tight">
            {pageTitle}
          </h1>
          
          {/* Right aligned session parameters containing identification labels, settings and bells */}
          <div className="flex items-center gap-4">
            
            {/* Live interactive notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-gray-500 hover:text-gold hover:bg-gray-50 rounded-lg transition-all duration-300 relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-96">
                  <div className="px-4 py-2.5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                    <span className="text-xs font-serif font-black text-gray-800">In-System Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-extrabold uppercase tracking-wider text-gold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 hover:bg-gold/5 transition-all duration-200 cursor-pointer text-left flex gap-3 ${!n.isRead ? 'bg-gold/2 border-l-2 border-gold font-medium' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${!n.isRead ? 'bg-gold animate-ping' : 'bg-transparent'}`} />
                          <div className="flex flex-col gap-0.5 flex-1 select-none">
                            <span className="text-xs font-extrabold text-gray-850">{n.title}</span> { /* Display notification title */ }
                            <span className="text-[11px] text-gray-500 leading-normal">{n.message}</span> { /* Display notification message text using new schema field */ }
                            <span className="text-[9px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> { /* Display formatted timestamp */ }
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                        <MessageSquare size={24} className="text-gray-300" />
                        <span>No new notifications</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Settings Gear */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 text-gray-500 hover:text-gold hover:bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer"
              title="Account Settings"
            >
              <Settings size={18} />
            </button>

            {/* Divider line */}
            <div className="w-px h-4 bg-gray-200"></div>

            {/* Show full name of current logged-in user inside platform layout */}
            <span className="text-xs font-bold text-gray-850 font-sans tracking-wide">
              {user && user.fullName ? user.fullName : "User Profile"}
            </span>
            
            {/* Action button triggering session termination */}
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-150 rounded px-3 py-1.5 font-bold uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-3xs"
            >
              Log Out
            </button>
            
          </div>
        </div>
        
        {/* Scrollable children body displaying actual pages nested subviews */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </div>
      </div>

      {/* GLOBAL ACCOUNT SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-[#12110e]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-150 max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <Shield className="text-gold" size={20} />
                <h3 className="font-serif font-black text-lg text-gray-900">Account Settings</h3>
              </div>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setSettingsError('');
                  setSettingsSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Form */}
            <form onSubmit={handleSettingsSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
              {settingsSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-extrabold uppercase tracking-widest p-3 rounded-xl flex items-center gap-2 animate-bounce">
                  <Check size={14} className="shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {settingsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-widest p-3 rounded-xl">
                  {settingsError}
                </div>
              )}

              {/* Avatar Photo Selection area */}
              <div className="flex flex-col items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gold/40 relative group shadow-sm flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview.startsWith('blob:') || photoPreview.startsWith('http') ? photoPreview : `${window.location.origin}/${photoPreview}`}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gold font-serif font-black text-2xl">
                      {(fullName || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-[#12110e]/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-[9px] font-bold uppercase tracking-wider">
                    <Upload size={14} className="mb-0.5 text-gold" />
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Profile Photo</span>
              </div>

              {/* Input for full name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Input for email address */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Enter email login"
                />
              </div>

              {/* Optional Password modification */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Lock size={12} /> Change Password (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Leave empty to keep current password"
                />
              </div>

              {/* Submit Buttons controls */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  disabled={settingsLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="flex-1 bg-gold hover:bg-gold-light text-charcoal font-bold uppercase tracking-widest text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {settingsLoading ? 'Saving...' : (
                    <>
                      <Sparkles size={12} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Export DashboardLayout as default module.
export default DashboardLayout;
