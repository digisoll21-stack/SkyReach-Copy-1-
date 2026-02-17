import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
            >
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Terms of Service
                </h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using SkyReach ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>
                            SkyReach provides a cold email outreach platform. We are not responsible for the content of your emails
                            or the consequences of your outreach activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Prohibited Activities</h2>
                        <p>
                            You may not use SkyReach to send unsolicited bulk emails (SPAM) that violate laws such as CAN-SPAM,
                            GDPR, or CASL. Any violation will lead to immediate account termination.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
                        <p>
                            SkyReach is provided "as is". We shall not be liable for any direct, indirect, or incidental damages
                            resulting from the use of our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Modifications</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the service
                            constitutes acceptance of new terms.
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

export default TermsPage;
