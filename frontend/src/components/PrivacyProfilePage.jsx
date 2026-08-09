import React from 'react';
import Navbar from './ui/shared/Navbar';

export const PrivacyPolicyPage = () => {
    return (
        <div>
            <Navbar/>
        <div className="bg-white min-h-screen py-16 px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-purple-600 mb-6 tracking-wide">Privacy Policy</h1>
                <p className="text-xl text-gray-800 mb-12 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
                <div className="space-y-8 text-left">
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-700">
                            We collect the following types of information:
                            <ul className="list-disc list-inside mt-2 text-gray-700">
                                <li>Personal Information: Name, email address, phone number, etc.</li>
                                <li>Usage Data: Information on how you use our services, such as device information, browsing history, etc.</li>
                                <li>Cookies: Small files placed on your device to enhance your experience on our site.</li>
                            </ul>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700">
                            We use the collected information to:
                            <ul className="list-disc list-inside mt-2 text-gray-700">
                                <li>Provide, improve, and personalize our services.</li>
                                <li>Communicate with you regarding your account or services.</li>
                                <li>Monitor and analyze usage for service improvements.</li>
                                <li>Comply with legal obligations.</li>
                            </ul>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">3. How We Protect Your Information</h2>
                        <p className="text-gray-700">
                            We take appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">4. Sharing Your Information</h2>
                        <p className="text-gray-700">
                            We do not sell or rent your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website or providing services.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">5. Your Rights</h2>
                        <p className="text-gray-700">
                            You have the right to:
                            <ul className="list-disc list-inside mt-2 text-gray-700">
                                <li>Access, correct, or delete your personal data.</li>
                                <li>Object to the processing of your data in certain circumstances.</li>
                                <li>Withdraw consent at any time.</li>
                            </ul>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">6. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700">
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-semibold text-purple-600 mb-4">7. Contact Us</h2>
                        <p className="text-gray-700">
                            If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:info@hirepoint.com" className="text-blue-500 hover:text-blue-700">info@hirepoint.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PrivacyPolicyPage;
