import React from 'react';
import { BarChart, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';

const LandingFooter = () => {
    return (
        <footer className="relative border-t border-white/10 bg-gray-900 pt-16 pb-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 text-left">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <BarChart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Echo</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            Empowering businesses with AI-driven insights to transform customer experiences and optimize performance.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-white font-semibold text-lg mb-6 text-left w-full">Product</h3>
                        <ul className="space-y-4 p-0 m-0 list-none text-left w-full">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Features</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Integrations</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Enterprise</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Security</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-white font-semibold text-lg mb-6 text-left w-full">Company</h3>
                        <ul className="space-y-4 p-0 m-0 list-none text-left w-full">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors block">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-white font-semibold text-lg mb-6 text-left w-full">Get in Touch</h3>
                        <ul className="space-y-4 p-0 m-0 list-none text-left w-full">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 mt-1 text-blue-400 shrink-0" />
                                <span>hello@echo.com</span>
                            </li>
                            <li className="text-gray-400 text-left">
                                123 Innovation Dr.<br />
                                Tech Valley, CA 94043
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Echo. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <span>by Echo Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
