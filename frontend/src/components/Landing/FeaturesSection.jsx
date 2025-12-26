import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Users, Clock, Shield, MessageSquare } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <BarChart className="w-6 h-6" />,
            title: "Real-time Analytics",
            description: "Monitor call metrics, agent performance, and customer satisfaction in real-time with interactive dashboards.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Sentiment Analysis",
            description: "AI-powered sentiment detection to understand customer emotions and identify pain points automatically.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Agent Performance",
            description: "Track individual agent metrics, identify top performers, and provide targeted coaching.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Historical Trends",
            description: "Analyze historical data to identify patterns, seasonal trends, and long-term performance improvements.",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: <PieChart className="w-6 h-6" />,
            title: "Custom Reports",
            description: "Generate custom reports and export data for in-depth analysis and stakeholder presentations.",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Compliant",
            description: "Enterprise-grade security with data encryption, access controls, and compliance certifications.",
            color: "from-indigo-500 to-indigo-600"
        }
    ];

    return (
        <div className="container mx-auto px-6 py-16 relative">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Everything you need to optimize your call center operations and deliver exceptional customer service.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -20 }}
                        transition={{ type: "spring", stiffness: 2000, damping: 10 }}
                        className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-8 border border-white/5 hover:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;
