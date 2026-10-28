import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaShieldAlt, 
  FaCreditCard,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaHistory,
  FaChartLine,
  FaCrown,
  FaBolt,
  FaUpload
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: profileForm.name
      });
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordEditMode(false);
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const userStats = {
    totalScans: 127,
    cleanFiles: 119,
    threatsDetected: 8,
    avgScanTime: '0.24s',
    gpuAccelerated: 124,
    daysActive: 45
  };

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Basic virus scanning',
        'Up to 100MB file size',
        '2 concurrent scans',
        '7-day history retention',
        'Email support'
      ],
      current: user?.plan === 'free'
    },
    {
      name: 'Pro',
      price: '$9.99/month',
      features: [
        'Advanced virus scanning',
        'Up to 1GB file size',
        '5 concurrent scans',
        'GPU acceleration',
        '30-day history retention',
        'Priority support',
        'Scheduled scans'
      ],
      current: user?.plan === 'premium'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Enterprise-grade scanning',
        'Unlimited file size',
        'Unlimited concurrent scans',
        'Dedicated GPU clusters',
        'Unlimited history',
        '24/7 phone support',
        'Custom integrations',
        'API access'
      ],
      current: false
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-outline"
          >
            {editMode ? (
              <>
                <FaTimes className="mr-2" />
                Cancel
              </>
            ) : (
              <>
                <FaEdit className="mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUser className="text-blue-600 text-xl" />
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="input-field pl-10"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        disabled
                        className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                        placeholder="Email cannot be changed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Contact support to change email address
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center text-gray-600">
                    <FaCalendar className="mr-2" />
                    {user.createdAt || 'January 1, 2024'}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner w-4 h-4 mr-2 border-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center text-gray-900">
                      <FaUser className="mr-2 text-gray-400" />
                      {user.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center text-gray-900">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center text-gray-600">
                    <FaCalendar className="mr-2" />
                    {user.createdAt || 'January 1, 2024'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2 text-blue-600" />
                    <span className="capitalize">{user.plan || 'free'} plan</span>
                    {user.plan === 'premium' && (
                      <span className="ml-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        <FaCrown className="inline mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <div className="p-3 bg-red-100 rounded-full">
                <FaShieldAlt className="text-red-600 text-xl" />
              </div>
            </div>

            {passwordEditMode ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaShieldAlt className="text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaShieldAlt className="text-gray-400" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaShieldAlt className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`input-field pl-10 pr-10 ${
                          passwordForm.confirmPassword && 
                          passwordForm.newPassword !== passwordForm.confirmPassword 
                            ? 'border-red-500' 
                            : ''
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && 
                     passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordEditMode(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner w-4 h-4 mr-2 border-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                  </div>
                  <button
                    onClick={() => setPasswordEditMode(true)}
                    className="btn-outline"
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add extra security to your account</p>
                  </div>
                  <button className="btn-outline">
                    Enable 2FA
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Active Sessions</h3>
                    <p className="text-sm text-gray-600">2 devices currently active</p>
                  </div>
                  <button className="btn-outline">
                    Manage Sessions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Subscription */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Stats</h2>
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Scans</span>
                <span className="font-bold text-gray-900">{userStats.totalScans}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Clean Files</span>
                <span className="font-bold text-green-600">{userStats.cleanFiles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Threats Detected</span>
                <span className="font-bold text-red-600">{userStats.threatsDetected}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Scan Time</span>
                <span className="font-bold text-purple-600">{userStats.avgScanTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">GPU Accelerated</span>
                <span className="font-bold text-blue-600">{userStats.gpuAccelerated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Days Active</span>
                <span className="font-bold text-yellow-600">{userStats.daysActive}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full btn-outline">
                <FaHistory className="mr-2" />
                View Detailed Stats
              </button>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaCreditCard className="text-purple-600 text-xl" />
              </div>
            </div>

            <div className="space-y-4">
              {subscriptionPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    plan.current
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                    </div>
                    {plan.current && (
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm">
                        <FaBolt className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!plan.current && (
                    <button className="w-full btn-outline mt-2">
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Billing Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Next Billing Date</span>
                  <span className="font-medium">March 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium">•••• 4242</span>
                </div>
              </div>
              <button className="w-full btn-outline mt-4">
                Manage Billing
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FaUpload className="text-blue-600 mr-3" />
                  <span>Upload & Scan</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FaHistory className="text-green-600 mr-3" />
                  <span>View Scan History</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FaChartLine className="text-purple-600 mr-3" />
                  <span>Download Reports</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card p-6 border border-yellow-200 bg-yellow-50">
        <h3 className="font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-yellow-200 bg-white rounded-lg hover:bg-yellow-50 text-left">
            <h4 className="font-medium text-gray-900 mb-1">Export Data</h4>
            <p className="text-sm text-gray-600">Download all your scan data</p>
          </button>
          <button className="p-4 border border-yellow-200 bg-white rounded-lg hover:bg-yellow-50 text-left">
            <h4 className="font-medium text-gray-900 mb-1">Delete Account</h4>
            <p className="text-sm text-gray-600">Permanently remove your account</p>
          </button>
          <button className="p-4 border border-yellow-200 bg-white rounded-lg hover:bg-yellow-50 text-left">
            <h4 className="font-medium text-gray-900 mb-1">Contact Support</h4>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;