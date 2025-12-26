import React from 'react';
import { ArrowRight, TrendingUp, MessageSquare } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const HeroSection = ({ onGetStarted }) => {
    return (
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
                        Echo provides AI-powered sentiment analysis and performance metrics
                        to help you understand customer emotions, optimize agent performance,
                        and improve overall customer satisfaction.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold !rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-purple-500/25"
                        >
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="px-6 py-3 border-2 border-gray-700 text-white font-semibold !rounded-full hover:border-gray-500 hover:bg-white/5 transition-all duration-300 cursor-pointer">
                            Watch Demo
                        </button>
                    </div>
                    <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">99%</div>
                            <div className="text-sm text-gray-400 font-medium">Accuracy</div>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">2.5x</div>
                            <div className="text-sm text-gray-400 font-medium">Faster Insights</div>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">24/7</div>
                            <div className="text-sm text-gray-400 font-medium">Real-time</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="lg:w-1/2 relative perspective-1000" data-aos="fade-left" data-aos-delay="200">
                    <DashboardPreview />
                </div>
            </div>
        </div>
    );
};

const DashboardPreview = () => {
    // Motion values for mouse position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth animation
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Map mouse position to rotation degrees
    // Range: -1 (left/top) to 1 (right/bottom) -> -20deg to 20deg
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate mouse position relative to center of the element
        // Result range: -0.5 to 0.5
        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        // Normalize to -0.5 to 0.5
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        // Reset to center (flat)
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative transform transition-all duration-200 ease-out preserve-3d cursor-pointer"
        >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" style={{ transform: "translateZ(-10px)" }}></div>

            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-1 shadow-2xl border border-white/10" style={{ transform: "translateZ(0px)" }}>
                <div className="bg-gray-900/80 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-lg font-semibold">Live Dashboard Preview</div>
                            <div className="text-sm text-gray-400">Real-time metrics</div>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                    </div>

                    {/* Mini Dashboard */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 2000, damping: 10 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-400">Service Level</div>
                                    <div className="text-2xl font-bold text-white">86.5%</div>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-400" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 2000, damping: 10 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-400">CSAT Score</div>
                                    <div className="text-2xl font-bold text-white">4.7/5</div>
                                </div>
                                <MessageSquare className="w-8 h-8 text-blue-400" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Mini Chart */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 2000, damping: 10 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-sm font-semibold">Call Volume</div>
                                <div className="text-xs text-gray-400">Last 7 days</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold">1,284</div>
                                <div className="text-xs text-green-400">+12%</div>
                            </div>
                        </div>
                        <div className="flex items-end h-24 space-x-2">
                            {[40, 60, 80, 45, 75, 90, 65].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                    <div className="relative w-full">
                                        <div
                                            className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-sm transition-all duration-300 group-hover:bg-purple-500"
                                            style={{ height: `${height}px` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HeroSection;
