import React from 'react';

const CTASection = ({ onGetStarted }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <div
                className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-violet-900/40 backdrop-blur-lg rounded-3xl p-8 lg:p-12 text-center border border-white/10 shadow-2xl"
                data-aos="fade-up"
            >
                {/* Glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Call Center?</h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join hundreds of companies using Echo to improve customer satisfaction and agent performance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-white text-purple-700 font-bold !rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
                        >
                            Start Free 14-Day Trial
                        </button>
                        <button className="px-8 py-4 border-2 border-gray-500 text-white font-semibold !rounded-full hover:border-gray-400 hover:bg-white/5 transition-all duration-300 cursor-pointer">
                            Schedule a Demo
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-4">
                        <span>✓ No credit card required</span>
                        <span>✓ 14-day free trial</span>
                        <span>✓ Cancel anytime</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CTASection;
