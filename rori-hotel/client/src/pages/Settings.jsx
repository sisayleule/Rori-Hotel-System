// Settings.jsx - Complete settings page for all user roles with 6 tabs and photo lock feature
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const Settings = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile states
  const [fullName, setFullName] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoLocked, setPhotoLocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  
  // Email states
  const [newEmail, setNewEmail] = useState('');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '', color: '' });
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [newApplicationAlerts, setNewApplicationAlerts] = useState(true);
  const [scoreAlerts, setScoreAlerts] = useState(true);
  
  // General states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Initialize data on mount
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhotoLocked(user.photoLocked || false);
      if (user.notifications) {
        setEmailNotifications(user.notifications.emailNotifications !== undefined ? user.notifications.emailNotifications : true);
        setMessageAlerts(user.notifications.messageAlerts !== undefined ? user.notifications.messageAlerts : true);
        setApplicationAlerts(user.notifications.applicationAlerts !== undefined ? user.notifications.applicationAlerts : true);
        setNewApplicationAlerts(user.notifications.newApplicationAlerts !== undefined ? user.notifications.newApplicationAlerts : true);
        setScoreAlerts(user.notifications.scoreAlerts !== undefined ? user.notifications.scoreAlerts : true);
      }
    }
  }, [user]);
  
  // Password strength calculator
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ level: 0, text: '', color: '' });
      return;
    }
    const length = newPassword.length;
    const hasNumbers = /\d/.test(newPassword);
    const hasLetters = /[a-zA-Z]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (length < 8) {
      setPasswordStrength({ level: 1, text: 'Weak', color: 'bg-red-500' });
    } else if (length >= 8 && (hasNumbers || hasLetters) && !(hasNumbers && hasLetters)) {
      setPasswordStrength({ level: 2, text: 'Fair', color: 'bg-orange-500' });
    } else if (length >= 8 && hasNumbers && hasLetters && !hasSpecial) {
      setPasswordStrength({ level: 3, text: 'Good', color: 'bg-yellow-500' });
    } else if (length >= 12 && hasNumbers && hasLetters && hasSpecial) {
      setPasswordStrength({ level: 4, text: 'Strong', color: 'bg-green-500' });
    } else {
      setPasswordStrength({ level: 2, text: 'Fair', color: 'bg-orange-500' });
    }
  }, [newPassword]);
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleUnlockPhoto = async () => {
    setUnlockLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/users/unlock-photo');
      setPhotoLocked(false);
      setShowUnlockConfirm(false);
      setSuccess('Profile photo unlocked. You can now change your photo.');
      const token = localStorage.getItem('token');
      login(token, { ...user, photoLocked: false });
    } catch (err) {
      setError('Failed to unlock photo. Please try again.');
    } finally {
      setUnlockLoading(false);
    }
  };
  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }
      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Profile updated successfully!');
      if (profilePhotoFile) {
        setPhotoLocked(true);
        setProfilePhotoPreview('');
        setProfilePhotoFile(null);
      }
      const token = localStorage.getItem('token');
      login(token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveEmail = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail.trim() === '') {
      setError('Please enter a new email address');
      return;
    }
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      setError('New email is the same as current email');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/users/email', { newEmail });
      setSuccess('Email updated successfully! Please log in again with your new email.');
      setNewEmail('');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/users/notifications', {
        emailNotifications,
        messageAlerts,
        applicationAlerts,
        newApplicationAlerts,
        scoreAlerts
      });
      setSuccess('Notification preferences saved successfully!');
    } catch (err) {
      setError('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRequest = async () => {
    const confirmed = window.confirm('Are you sure you want to request account deletion? This will notify HR.');
    if (!confirmed) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/users/delete-request');
      setSuccess('Deletion request submitted. HR has been notified.');
    } catch (err) {
      setError('Failed to submit deletion request');
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToDashboard = () => {
    if (user.role === 'student') navigate('/student/dashboard');
    else if (user.role === 'hr') navigate('/hr/dashboard');
    else if (user.role.startsWith('supervisor_')) navigate('/supervisor/dashboard');
  };
  
  const getPageTitle = () => {
    if (user.role === 'student') return 'Student Settings';
    if (user.role === 'hr') return 'HR Settings';
    if (user.role.startsWith('supervisor_')) return 'Supervisor Settings';
    return 'Settings';
  };

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-[#C9A84C]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout role={user.role} pageTitle={getPageTitle()}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-gray-900 mb-2">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
        </div>
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {['profile', 'email', 'password', 'notifications', 'privacy', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{user.fullName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                
                {photoLocked ? (
                  <div className="w-full max-w-md">
                    <div className="border-2 border-[#C9A84C] rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🔒</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Profile Photo Locked</p>
                          <p className="text-xs text-gray-600">Your photo is saved and locked. Click Unlock to change it.</p>
                        </div>
                      </div>
                    </div>
                    {!showUnlockConfirm ? (
                      <button
                        onClick={() => setShowUnlockConfirm(true)}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        🔓 Unlock Photo
                      </button>
                    ) : (
                      <div className="border-2 border-yellow-500 bg-yellow-50 rounded-xl p-4">
                        <p className="text-sm text-gray-900 mb-3">Are you sure you want to unlock your profile photo so you can change it?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUnlockPhoto}
                            disabled={unlockLoading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50"
                          >
                            {unlockLoading ? 'Unlocking...' : 'Yes, Unlock It'}
                          </button>
                          <button
                            onClick={() => setShowUnlockConfirm(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <div className="border-2 border-emerald-500 bg-emerald-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔓</span>
                        <p className="text-sm font-medium text-emerald-700">Photo unlocked — you can now upload a new photo</p>
                      </div>
                    </div>
                    <label className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors cursor-pointer">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 italic text-center mt-2">Once you save a new photo it will be automatically locked again</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <input
                  type="text"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not Available'}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* Email Tab - Change primary email address with re-login required after save */}
          {activeTab === 'email' && (
            <div>
              {/* Section title describing email modification purpose */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Settings</h2>
              
              {/* Current email readonly display field showing active account email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
                {/* Input showing user.email in readonly state preventing edits */}
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              
              {/* New email input accepting user typed replacement email address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Email Address</label>
                {/* Input binding newEmail state with onChange handler */}
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
              </div>
              
              {/* Warning notice informing user about re-login requirement */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  {/* Warning emoji icon indicating important notice */}
                  <span className="text-2xl">⚠️</span>
                  <div>
                    {/* Bold warning title text */}
                    <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
                    {/* Warning detail explaining logout consequence after email update */}
                    <p className="text-xs text-amber-800">After changing your email, you will be logged out automatically. Please log back in using your new email address.</p>
                  </div>
                </div>
              </div>
              
              {/* Save email button triggering handleSaveEmail function on click */}
              <button
                onClick={handleSaveEmail}
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50"
              >
                {/* Dynamic button text showing loading state or default save text */}
                {loading ? '⏳ Updating...' : 'Update Email'}
              </button>
            </div>
          )}
          
          {/* Password Tab - Change account password with strength indicator and requirements checklist */}
          {activeTab === 'password' && (
            <div>
              {/* Section title describing password modification purpose */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Password Settings</h2>
              
              {/* Current password input for verification before allowing password change */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                {/* Password input binding currentPassword state with onChange handler */}
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
              </div>
              
              {/* New password input accepting user typed replacement password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                {/* Password input binding newPassword state with onChange handler */}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
                
                {/* Password strength indicator bar showing visual feedback on password quality */}
                {newPassword && (
                  <div className="mt-3">
                    {/* Label describing strength meter purpose */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      {/* Strength level text with dynamic color based on calculated strength */}
                      <span className={`text-xs font-semibold ${
                        passwordStrength.level === 1 ? 'text-red-600' :
                        passwordStrength.level === 2 ? 'text-orange-600' :
                        passwordStrength.level === 3 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    {/* Visual strength bar with dynamic width and color based on password quality */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm password input ensuring user typed matching password correctly twice */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                {/* Password input binding confirmPassword state with onChange handler */}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
              </div>
              
              {/* Password requirements checklist informing user about security rules */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-3">Password Requirements:</p>
                {/* Unordered list displaying password strength criteria with check marks */}
                <ul className="space-y-2 text-xs text-gray-700">
                  {/* Requirement 1: Minimum 8 characters length */}
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>At least 8 characters long</span>
                  </li>
                  {/* Requirement 2: Mix of letters and numbers for Fair level */}
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Contains both letters and numbers (Fair)</span>
                  </li>
                  {/* Requirement 3: Letters plus numbers for Good level */}
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Mix of letters and numbers (Good)</span>
                  </li>
                  {/* Requirement 4: 12+ characters with all types for Strong level */}
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>12+ characters with letters, numbers, and symbols (Strong)</span>
                  </li>
                </ul>
              </div>
              
              {/* Save password button triggering handleSavePassword function on click */}
              <button
                onClick={handleSavePassword}
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50"
              >
                {/* Dynamic button text showing loading state or default save text */}
                {loading ? '⏳ Updating...' : 'Update Password'}
              </button>
            </div>
          )}
          
          {/* Notifications Tab - Configure alert preferences with role-specific toggles */}
          {activeTab === 'notifications' && (
            <div>
              {/* Section title describing notification preferences purpose */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              {/* Info card explaining notification system behavior */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  {/* Info emoji icon indicating informational notice */}
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    {/* Info title text */}
                    <p className="text-sm font-semibold text-blue-900 mb-1">Manage Your Alerts</p>
                    {/* Info detail explaining toggle controls functionality */}
                    <p className="text-xs text-blue-800">Control which notifications you receive. Some options are role-specific.</p>
                  </div>
                </div>
              </div>
              
              {/* Notification toggles list with dividers between each option */}
              <div className="mb-6 divide-y divide-gray-200">
                {/* Toggle 1: General email notifications - visible to all roles */}
                <ToggleSwitch
                  enabled={emailNotifications}
                  onChange={setEmailNotifications}
                  label="Email Notifications"
                />
                
                {/* Toggle 2: Message alerts - visible to all roles */}
                <ToggleSwitch
                  enabled={messageAlerts}
                  onChange={setMessageAlerts}
                  label="Message Alerts"
                />
                
                {/* Toggle 3: Application status updates - visible only to students */}
                {user.role === 'student' && (
                  <ToggleSwitch
                    enabled={applicationAlerts}
                    onChange={setApplicationAlerts}
                    label="Application Status Updates"
                  />
                )}
                
                {/* Toggle 4: New application alerts - visible only to HR */}
                {user.role === 'hr' && (
                  <ToggleSwitch
                    enabled={newApplicationAlerts}
                    onChange={setNewApplicationAlerts}
                    label="New Application Alerts"
                  />
                )}
                
                {/* Toggle 5: Score submission alerts - visible to students and supervisors */}
                {(user.role === 'student' || user.role.startsWith('supervisor_')) && (
                  <ToggleSwitch
                    enabled={scoreAlerts}
                    onChange={setScoreAlerts}
                    label="Score & Evaluation Alerts"
                  />
                )}
              </div>
              
              {/* Save notifications button triggering handleSaveNotifications function on click */}
              <button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50"
              >
                {/* Dynamic button text showing loading state or default save text */}
                {loading ? '⏳ Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
          
          {/* Privacy Tab - View active sessions, account security info, and delete account option */}
          {activeTab === 'privacy' && (
            <div>
              {/* Section title describing privacy and security management purpose */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
              
              {/* Active Sessions card showing current login session details */}
              <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Active Sessions</h3>
                {/* Current session indicator showing device and login timestamp */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Device icon representing current browser session */}
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-lg">💻</span>
                    </div>
                    <div>
                      {/* Device type label */}
                      <p className="text-sm font-semibold text-gray-900">Current Device</p>
                      {/* Login timestamp showing when session started */}
                      <p className="text-xs text-gray-600">Active now</p>
                    </div>
                  </div>
                  {/* Current session badge indicating active status */}
                  <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                    This device
                  </span>
                </div>
              </div>
              
              {/* Account Security info card providing security status overview */}
              <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-start gap-3">
                  {/* Shield emoji icon indicating security status */}
                  <span className="text-2xl">🛡️</span>
                  <div>
                    {/* Security status title */}
                    <p className="text-sm font-semibold text-emerald-900 mb-1">Account Security</p>
                    {/* Security status detail message */}
                    <p className="text-xs text-emerald-800">Your account is protected with password authentication. Change your password regularly to maintain security.</p>
                  </div>
                </div>
              </div>
              
              {/* Danger Zone section containing destructive account deletion action */}
              <div className="p-6 bg-red-50 border-2 border-red-300 rounded-xl">
                <h3 className="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
                {/* Warning text explaining account deletion consequences */}
                <p className="text-xs text-red-800 mb-4">
                  Once you request account deletion, HR will be notified and your account will be reviewed. This action cannot be undone.
                </p>
                {/* Delete account button triggering handleDeleteRequest function on click */}
                <button
                  onClick={handleDeleteRequest}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {/* Dynamic button text showing loading state or default delete text */}
                  {loading ? 'Submitting...' : 'Request Account Deletion'}
                </button>
              </div>
            </div>
          )}
          
          {/* About Tab - System information, version, and quick links */}
          {activeTab === 'about' && (
            <div>
              {/* Section title describing about page purpose */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">About</h2>
              
              {/* Logo and branding section displaying hotel logo and name */}
              <div className="flex flex-col items-center mb-8">
                {/* Hotel logo image with rounded border */}
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
                  alt="Rori Hotel Logo" 
                  className="w-20 h-20 object-contain rounded-full border-2 border-gray-200 p-2 bg-white mb-4" 
                  referrerPolicy="no-referrer"
                />
                {/* Hotel name title in serif font */}
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Rori Hotel</h3>
                {/* System name subtitle */}
                <p className="text-sm text-gray-600">Internship Management System</p>
              </div>
              
              {/* Version information card showing current system version */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  {/* Version label */}
                  <span className="text-sm font-semibold text-gray-700">Version</span>
                  {/* Version number */}
                  <span className="text-sm text-gray-900 font-mono">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  {/* Release date label */}
                  <span className="text-sm font-semibold text-gray-700">Released</span>
                  {/* Release date value */}
                  <span className="text-sm text-gray-900">2024</span>
                </div>
              </div>
              
              {/* Quick Links section providing navigation to important pages */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
                {/* Links list with dividers between each link */}
                <div className="space-y-2">
                  {/* Dashboard link redirecting to role-specific dashboard */}
                  <button
                    onClick={navigateToDashboard}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
              
              {/* Footer section with copyright and acknowledgment */}
              <div className="pt-6 border-t border-gray-200 text-center">
                {/* Copyright text with current year */}
                <p className="text-xs text-gray-500 mb-1">
                  © {new Date().getFullYear()} Rori Hotel. All rights reserved.
                </p>
                {/* System description subtitle */}
                <p className="text-xs text-gray-400">
                  Internship Management System
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Export Settings component as default module
export default Settings;
