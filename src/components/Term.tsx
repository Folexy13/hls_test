import React from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.jpg";

const TermsAndConditions = () => {

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <img src={logo} alt="Logo" className=" mx-auto mb-4"/>

                <h1 className="text-3xl font-bold text-center mb-8">Terms and Conditions</h1>
                
                <div className="prose max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using this platform, you accept and agree to be bound by these Terms and Conditions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">2. User Responsibilities</h2>
                        <p className="mb-4">
                            As a user of this platform, you agree to:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li className="mb-2">Provide accurate and complete information during registration</li>
                            <li className="mb-2">Maintain the confidentiality of your account credentials</li>
                            <li className="mb-2">Use the platform only for lawful purposes</li>
                            <li className="mb-2">Not engage in any fraudulent activities</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">3. Medical Professional Requirements</h2>
                        <p className="mb-4">
                            Medical professionals using this platform must:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li className="mb-2">Provide valid license information</li>
                            <li className="mb-2">Maintain all necessary certifications</li>
                            <li className="mb-2">Comply with all applicable medical regulations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">4. Privacy Policy</h2>
                        <p className="mb-4">
                            Your personal information will be handled in accordance with our Privacy Policy. We collect necessary data to provide our services and comply with legal requirements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">5. Payment Terms</h2>
                        <p className="mb-4">
                            All payment transactions are processed securely. You agree to provide accurate payment information and authorize us to charge your account for services rendered.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
                        <p className="mb-4">
                            We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our discretion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
                        <p className="mb-4">
                            We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
                        <p>
                            For questions about these Terms and Conditions, please contact us at support@medplatform.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions