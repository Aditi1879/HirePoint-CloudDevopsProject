import React, { useState } from 'react';
import Navbar from './ui/shared/Navbar';

export const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <div>
            <Navbar/>
        <div className="bg-white min-h-screen py-16 px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-purple-600 mb-6 tracking-wide">Contact Us</h1>
                <p className="text-xl text-gray-800 mb-12 leading-relaxed">
                    Have any questions or need assistance? Reach out to us! We’d love to hear from you.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white shadow-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 border border-gray-200 max-w-xs mx-auto">
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">Get in Touch</h3>
                        <p className="text-gray-700 text-lg mb-4">
                            Feel free to contact us via the form below, or use the details provided to reach us directly.
                        </p>
                        <div className="text-left">
                            <p className="text-gray-700 mb-2">
                                <strong>Email:</strong> <a href="mailto:info@hirepoint.com" className="text-blue-500 hover:text-blue-700">info@hirepoint.com</a>
                            </p>
                            <p className="text-gray-700">
                                <strong>Phone:</strong> (+91) 8983325223
                            </p>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 border border-gray-200 max-w-xs mx-auto">
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows="4"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ContactUsPage;
