import React from 'react';
import Navbar from './ui/shared/Navbar';

export const AboutUsPage = () => {
    return (
        <div>
            <Navbar/>
        <div className="bg-white min-h-screen py-16 px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-purple-600 mb-6 tracking-wide">About Us</h1>
                <p className="text-xl text-gray-800 mb-12 leading-relaxed">
                    We are passionate about connecting job seekers with their dream careers. Our platform
                    is dedicated to providing easy access to the latest job opportunities across various
                    industries. Whether you're a student, a seasoned professional, or a recruiter, our goal
                    is to make the job-hunting experience simple and efficient.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="bg-white shadow-lg rounded-xl p-8 transform transition duration-300 hover:scale-105 border border-gray-200">
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">Our Mission</h3>
                        <p className="text-gray-700 text-lg">
                            To empower individuals by providing a platform for them to find fulfilling jobs
                            that align with their skills and career goals.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-8 transform transition duration-300 hover:scale-105 border border-gray-200">
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">Our Values</h3>
                        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
                            <li>Integrity</li>
                            <li>Transparency</li>
                            <li>Innovation</li>
                            <li>Customer-Centricity</li>
                        </ul>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-8 transform transition duration-300 hover:scale-105 border border-gray-200">
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">Our Vision</h3>
                        <p className="text-gray-700 text-lg">
                            To be the leading job portal where employers and job seekers seamlessly connect,
                            driving success and growth in industries worldwide.
                        </p>
                    </div>
                </div>
                <div className="mt-16">
                    <h3 className="text-3xl font-semibold text-purple-600 mb-4">Get in Touch</h3>
                    <p className="text-gray-800 text-lg">
                        Have questions? Feel free to <a href="mailto:info@hirepoint.com" className="text-blue-500 hover:text-blue-700 transition">email us</a>.
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AboutUsPage;
