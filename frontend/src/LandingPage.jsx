import React from 'react';
import { BarChart, PieChart, TrendingUp, Users, Clock, Shield, MessageSquare, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white overflow-hidden pt-16">
      {/* Hero Section - Removed duplicate nav */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0" data-aos="fade-right">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Call Center
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Insights in Real-Time
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
              Echo Analytics provides AI-powered sentiment analysis and performance metrics 
              to help you understand customer emotions, optimize agent performance, 
              and improve overall customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold !rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-6 py-3 border-2 border-gray-700 text-white font-semibold !rounded-full hover:border-gray-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2.5x</div>
                <div className="text-sm text-gray-400">Faster Insights</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-gray-400">Real-time</div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="lg:w-1/2 relative" data-aos="fade-left" data-aos-delay="200">
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-1 shadow-2xl">
              <div className="bg-gray-900/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-lg font-semibold">Live Dashboard Preview</div>
                    <div className="text-sm text-gray-400">Real-time metrics</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Mini Dashboard */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/60 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Service Level</div>
                        <div className="text-2xl font-bold">86.5%</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">CSAT Score</div>
                        <div className="text-2xl font-bold">4.7/5</div>
                      </div>
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </div>
                
                {/* Mini Chart */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold">Call Volume</div>
                    <div className="text-xs text-gray-400">Last 7 days</div>
                  </div>
                  <div className="flex items-end h-24 space-x-2">
                    {[40, 60, 80, 45, 75, 90, 65].map((height, index) => (
                      <div key={index} className="flex-1">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Everything you need to optimize your call center operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
            <p className="text-gray-300 text-sm">
              Monitor call metrics, agent performance, and customer satisfaction in real-time with interactive dashboards.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sentiment Analysis</h3>
            <p className="text-gray-300 text-sm">
              AI-powered sentiment detection to understand customer emotions and identify pain points automatically.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Agent Performance</h3>
            <p className="text-gray-300 text-sm">
              Track individual agent metrics, identify top performers, and provide targeted coaching.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Historical Trends</h3>
            <p className="text-gray-300 text-sm">
              Analyze historical data to identify patterns, seasonal trends, and long-term performance improvements.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Reports</h3>
            <p className="text-gray-300 text-sm">
              Generate custom reports and export data for in-depth analysis and stakeholder presentations.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-500" data-aos="fade-up">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
            <p className="text-gray-300 text-sm">
              Enterprise-grade security with data encryption, access controls, and compliance certifications.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 via-purple-900/30 to-violet-900/30 backdrop-blur-lg rounded-3xl p-8 lg:p-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Call Center?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies using Echo Analytics to improve customer satisfaction and agent performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-white text-purple-700 font-semibold !rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Start Free 14-Day Trial
            </button>
            <button className="px-6 py-3 border-2 border-gray-600 text-white font-semibold !rounded-full hover:border-gray-500 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-6">No credit card required • Cancel anytime</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Echo Analytics</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 Echo Analytics. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;