import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; // Added Navigate import
import { toast } from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demo
const mockUsers = [
  {
    id: 1,
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'user',
    plan: 'premium',
    createdAt: '2024-01-01'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for saved session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('cuda_scanner_token');
      const userData = localStorage.getItem('cuda_scanner_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('cuda_scanner_token');
      localStorage.removeItem('cuda_scanner_user');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        plan: foundUser.plan,
        createdAt: foundUser.createdAt
      };

      // Generate mock token
      const token = `mock_jwt_token_${Date.now()}`;

      // Store in localStorage
      localStorage.setItem('cuda_scanner_token', token);
      localStorage.setItem('cuda_scanner_user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      const userExists = mockUsers.find(u => u.email === userData.email);
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Mock API response
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        plan: newUser.plan,
        createdAt: newUser.createdAt
      };

      // Generate mock token
      const token = `mock_jwt_token_${Date.now()}`;

      // Store in localStorage
      localStorage.setItem('cuda_scanner_token', token);
      localStorage.setItem('cuda_scanner_user', JSON.stringify(userResponse));

      // Update state
      setUser(userResponse);
      setIsAuthenticated(true);
      
      toast.success('Account created successfully!');
      return userResponse;
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cuda_scanner_token');
    localStorage.removeItem('cuda_scanner_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user in state
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('cuda_scanner_user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Update user password
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock password update logic
      const currentUser = mockUsers.find(u => u.id === user?.id);
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      if (currentUser.password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password in mock data
      currentUser.password = newPassword;
      
      toast.success('Password updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has specific plan
  const hasPlan = (plan) => {
    return user?.plan === plan;
  };

  // Get user permissions
  const getUserPermissions = () => {
    const permissions = {
      canScanFiles: true,
      canViewHistory: true,
      canManageSettings: true,
      canUseGPU: user?.plan === 'premium',
      canScheduleScans: user?.plan === 'premium',
      canExportReports: true,
      maxFileSize: user?.plan === 'premium' ? 1000 : 100, // MB
      maxConcurrentScans: user?.plan === 'premium' ? 5 : 2
    };
    
    return permissions;
  };

  // Value to provide to consumers
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    hasRole,
    hasPlan,
    getUserPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Private Route component
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};