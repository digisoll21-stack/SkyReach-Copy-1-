import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
            >
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us (name, email, company) and information
                            related to your email campaigns, including recipient lists and email content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Information</h2>
                        <p>
                            We use the collected information to provide and improve the Service, communicate with you,
                            and ensure compliance with anti-spam regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Data Sharing</h2>
                        <p>
                            We do not sell your personal data. We share data only with trusted service providers
                            (e.g., database hosting, email APIs) required to operate the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Security</h2>
                        <p>
                            We use industry-standard encryption (AES-256 for credentials, SSL/TLS for transport)
                            to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data at any time through
                            your account settings or by contacting us.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-sm text-gray-400">
                    Last updated: February 15, 2026
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPage;
