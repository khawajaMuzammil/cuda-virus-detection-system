import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle, FaArrowLeft, FaKey } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [step, setStep] = useState(1); // 1: Email input, 2: Code verification, 3: New password
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
      
      // For demo, show the code (in real app, this would be emailed)
      const demoCode = '123456';
      toast.success(`Password reset email sent! Demo code: ${demoCode}`, { 
        duration: 6000,
        icon: '🔑'
      });
      
      setStep(2);
    }, 1500);
  };

  const handleCodeVerification = (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    
    // Simulate code verification
    setTimeout(() => {
      setLoading(false);
      
      // For demo, accept any 6-digit code
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        toast.success('Code verified successfully!');
        setStep(3);
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    }, 1000);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successful! You can now login with your new password.');
      
      // Reset form
      setStep(1);
      setEmail('');
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleResendCode = () => {
    setLoading(true);
    
    // Simulate resend
    setTimeout(() => {
      setLoading(false);
      const newDemoCode = Math.floor(100000 + Math.random() * 900000);
      toast.success(`New code sent! Demo code: ${newDemoCode}`, { 
        duration: 6000,
        icon: '🔄'
      });
    }, 1000);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}>
              {step > stepNumber ? <FaCheckCircle /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-600 mt-2">
                Enter your email address and we'll send you a code to reset your password
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 mr-2 border-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>
          </>
        );

      case 2:
        return (
          <>
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <p className="text-gray-600 mt-2">
                We've sent a 6-digit verification code to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                The code will expire in 10 minutes
              </p>
            </div>

            <form onSubmit={handleCodeVerification} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="flex space-x-2 justify-center">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={verificationCode[index] || ''}
                      onChange={(e) => {
                        const newCode = verificationCode.split('');
                        newCode[index] = e.target.value;
                        setVerificationCode(newCode.join(''));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          document.getElementById(`code-${index + 1}`)?.focus();
                        }
                      }}
                      id={`code-${index}`}
                      className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full btn-primary py-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 mr-2 border-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </div>
            </form>
          </>
        );

      case 3:
        return (
          <>
            <div className="text-center mb-8">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-2xl text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
              <p className="text-gray-600 mt-2">
                Please enter your new password. Make sure it's secure and memorable.
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEnvelope className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEnvelope className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-full h-1 rounded-full ${
                      newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                    <div className={`w-full h-1 rounded-full ${
                      /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                    <div className={`w-full h-1 rounded-full ${
                      /\d/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                    <div className={`w-full h-1 rounded-full ${
                      /[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      • At least 8 characters long
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                      • Contains uppercase letter
                    </li>
                    <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                      • Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                      • Contains special character
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`input-field pl-10 pr-10 ${
                      confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEnvelope className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEnvelope className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className="w-full btn-primary py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 mr-2 border-2"></div>
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {renderStepIndicator()}
        
        {renderStepContent()}

        <div className="text-center mt-6">
          {step === 1 && (
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" />
              Back to login
            </Link>
          )}
          
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" />
              Go back
            </button>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <FaCheckCircle className="mr-2" />
            Security Information
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Password reset links expire after 10 minutes</li>
            <li>• Each reset code can only be used once</li>
            <li>• You will be logged out of all devices after reset</li>
            <li>• Contact support if you didn't request this reset</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;