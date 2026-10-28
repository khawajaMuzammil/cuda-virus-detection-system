import React, { useState } from 'react';
import { 
  FaCog, 
  FaShieldAlt, 
  FaBell, 
  FaUser, 
  FaSave, 
  FaPowerOff,
  FaMicrochip,
  FaDatabase,
  FaCloud,
  FaKey,
  FaLanguage,
  FaPalette,
  FaClock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    autoStart: true,
    language: 'en',
    theme: 'light',
    
    // Scan Settings
    autoScan: true,
    scanDepth: 'standard', // quick, standard, deep
    quarantineAuto: true,
    maxFileSize: 100, // MB
    
    // Notifications
    emailNotifications: true,
    desktopNotifications: true,
    threatAlerts: true,
    scanCompleteAlerts: true,
    
    // Privacy
    autoDeleteScans: false,
    deleteAfterDays: 30,
    shareAnonymousData: false,
    
    // GPU Settings
    gpuAcceleration: true,
    gpuPriority: 'balanced', // balanced, performance, power-saving
    cudaCores: 'auto', // auto, manual
    
    // Account
    twoFactorAuth: false,
    sessionTimeout: 60, // minutes
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        autoStart: true,
        language: 'en',
        theme: 'light',
        autoScan: true,
        scanDepth: 'standard',
        quarantineAuto: true,
        maxFileSize: 100,
        emailNotifications: true,
        desktopNotifications: true,
        threatAlerts: true,
        scanCompleteAlerts: true,
        autoDeleteScans: false,
        deleteAfterDays: 30,
        shareAnonymousData: false,
        gpuAcceleration: true,
        gpuPriority: 'balanced',
        cudaCores: 'auto',
        twoFactorAuth: false,
        sessionTimeout: 60,
      });
      toast.info('Settings reset to defaults');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // Simulate password change
    setSaving(true);
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');
      setSaving(false);
    }, 1500);
  };

  const settingSections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <FaCog className="text-blue-600" />,
      settings: [
        {
          id: 'autoStart',
          label: 'Start with system',
          description: 'Automatically launch scanner when system starts',
          type: 'toggle'
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Interface language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'ja', label: 'Japanese' }
          ]
        },
        {
          id: 'theme',
          label: 'Theme',
          description: 'Application theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        }
      ]
    },
    {
      id: 'scan',
      title: 'Scan Settings',
      icon: <FaShieldAlt className="text-green-600" />,
      settings: [
        {
          id: 'autoScan',
          label: 'Auto-scan new files',
          description: 'Automatically scan files when added to monitored folders',
          type: 'toggle'
        },
        {
          id: 'scanDepth',
          label: 'Scan depth',
          description: 'Determines how thoroughly files are scanned',
          type: 'select',
          options: [
            { value: 'quick', label: 'Quick Scan' },
            { value: 'standard', label: 'Standard Scan' },
            { value: 'deep', label: 'Deep Scan' }
          ]
        },
        {
          id: 'quarantineAuto',
          label: 'Auto-quarantine threats',
          description: 'Automatically move detected threats to quarantine',
          type: 'toggle'
        },
        {
          id: 'maxFileSize',
          label: 'Maximum file size',
          description: 'Largest file size to scan (in MB)',
          type: 'range',
          min: 10,
          max: 1000,
          unit: 'MB'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FaBell className="text-yellow-600" />,
      settings: [
        {
          id: 'emailNotifications',
          label: 'Email notifications',
          description: 'Receive scan reports via email',
          type: 'toggle'
        },
        {
          id: 'desktopNotifications',
          label: 'Desktop notifications',
          description: 'Show notifications on your desktop',
          type: 'toggle'
        },
        {
          id: 'threatAlerts',
          label: 'Threat alerts',
          description: 'Get immediate alerts when threats are found',
          type: 'toggle'
        },
        {
          id: 'scanCompleteAlerts',
          label: 'Scan completion alerts',
          description: 'Notify when scans complete',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'gpu',
      title: 'GPU Acceleration',
      icon: <FaMicrochip className="text-purple-600" />,
      settings: [
        {
          id: 'gpuAcceleration',
          label: 'Enable CUDA acceleration',
          description: 'Use NVIDIA GPU for faster scanning',
          type: 'toggle'
        },
        {
          id: 'gpuPriority',
          label: 'GPU priority',
          description: 'Balance between performance and power usage',
          type: 'select',
          options: [
            { value: 'power-saving', label: 'Power Saving' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'performance', label: 'Maximum Performance' }
          ]
        },
        {
          id: 'cudaCores',
          label: 'CUDA cores usage',
          description: 'Number of GPU cores to use for scanning',
          type: 'select',
          options: [
            { value: 'auto', label: 'Auto (Recommended)' },
            { value: 'manual', label: 'Manual Configuration' }
          ]
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: <FaDatabase className="text-red-600" />,
      settings: [
        {
          id: 'autoDeleteScans',
          label: 'Auto-delete scan history',
          description: 'Automatically delete old scan records',
          type: 'toggle'
        },
        {
          id: 'deleteAfterDays',
          label: 'Delete after days',
          description: 'Days to keep scan history',
          type: 'range',
          min: 7,
          max: 365,
          unit: 'days'
        },
        {
          id: 'shareAnonymousData',
          label: 'Share anonymous data',
          description: 'Help improve detection by sharing anonymous scan data',
          type: 'toggle'
        }
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[setting.id]}
              onChange={(e) => handleSettingChange(setting.category, setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      
      case 'select':
        return (
          <select
            value={settings[setting.id]}
            onChange={(e) => handleSettingChange(setting.category, setting.id, e.target.value)}
            className="input-field"
          >
            {setting.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              value={settings[setting.id]}
              onChange={(e) => handleSettingChange(setting.category, setting.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{settings[setting.id]} {setting.unit}</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your CUDA Scanner preferences</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleReset}
            className="btn-outline"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <FaSave className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Settings Categories</h3>
              <nav className="space-y-2">
                {settingSections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </a>
                ))}
                <a
                  href="#account"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >
                  <FaUser className="text-indigo-600" />
                  <span>Account Security</span>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {settingSections.map(section => (
            <div key={section.id} id={section.id} className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                {section.icon}
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.settings.map(setting => (
                  <div key={setting.id} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="mb-4 md:mb-0 md:w-2/3">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-600">
                        {setting.description}
                      </p>
                    </div>
                    <div className="md:w-1/3">
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Account Security */}
          <div id="account" className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaUser className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Account Security</h2>
            </div>

            {/* Two-Factor Authentication */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {settings.twoFactorAuth && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Two-factor authentication is enabled. Use your authenticator app when signing in.
                  </p>
                </div>
              )}
            </div>

            {/* Session Timeout */}
            <div className="py-4 border-b border-gray-100">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-1">Session Timeout</h3>
                <p className="text-sm text-gray-600">
                  Automatically log out after period of inactivity
                </p>
              </div>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('account', 'sessionTimeout', parseInt(e.target.value))}
                className="input-field"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>

            {/* Change Password */}
            <div className="py-4">
              <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field pr-10"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pr-10"
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
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>

          {/* System Information */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">System Information</h2>
                <p className="text-gray-600">Your current system configuration</p>
              </div>
              <FaCog className="text-gray-400 text-2xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <FaMicrochip className="text-purple-600" />
                  <span className="font-medium">GPU Acceleration</span>
                </div>
                <div className="text-sm text-gray-600">
                  {settings.gpuAcceleration ? 'Enabled (CUDA)' : 'Disabled'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <FaDatabase className="text-blue-600" />
                  <span className="font-medium">Scan History</span>
                </div>
                <div className="text-sm text-gray-600">
                  {settings.autoDeleteScans ? `Auto-delete after ${settings.deleteAfterDays} days` : 'Kept indefinitely'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <FaShieldAlt className="text-green-600" />
                  <span className="font-medium">Scan Mode</span>
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {settings.scanDepth} • {settings.autoScan ? 'Auto-scan enabled' : 'Manual scan'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <FaBell className="text-yellow-600" />
                  <span className="font-medium">Notifications</span>
                </div>
                <div className="text-sm text-gray-600">
                  {settings.emailNotifications ? 'Email' : ''} 
                  {settings.emailNotifications && settings.desktopNotifications ? ' • ' : ''}
                  {settings.desktopNotifications ? 'Desktop' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <FaPowerOff className="text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Clear All Data</h3>
                <p className="text-sm text-red-800 mb-3">
                  This will permanently delete all scan history, settings, and account data.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
                      toast.error('Data cleared (simulated)');
                    }
                  }}
                  className="btn-danger"
                >
                  Clear All Data
                </button>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-800 mb-3">
                  Permanently delete your account and all associated data.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
                      toast.error('Account deletion requested (simulated)');
                    }
                  }}
                  className="btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;