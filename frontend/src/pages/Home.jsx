import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaUpload, FaChartBar, FaCubes, FaLock } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-security text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              <FaShieldAlt className="inline-block mr-4 mb-2" />
              CUDA Virus Scanner
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              High-performance virus detection powered by GPU acceleration and parallel computing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn-outline text-lg px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CUDA Scanner?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Leverage the power of parallel computing for lightning-fast virus detection
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBolt className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">GPU Accelerated</h3>
            <p className="text-gray-600">
              Utilize NVIDIA CUDA technology for parallel pattern matching, scanning files up to 100x faster
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUpload className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Scanning</h3>
            <p className="text-gray-600">
              Upload and scan files instantly with real-time threat detection and detailed reporting
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              All files are processed securely with automatic cleanup. Your data never leaves our servers
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Upload File", desc: "Drag & drop or select any file for scanning" },
              { step: 2, title: "GPU Processing", desc: "File is analyzed using CUDA parallel computing" },
              { step: 3, title: "Threat Detection", desc: "Pattern matching against virus signatures" },
              { step: 4, title: "Get Results", desc: "Detailed report with cleaning options" }
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-1/2 h-0.5 bg-blue-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-cuda text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Lightning-Fast Scanning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust our GPU-accelerated virus detection
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            <FaChartBar className="mr-2" />
            Start Scanning Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;