import React from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.jpg";

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <img src={logo} alt="Logo" className="mx-auto mb-4" />

                <h1 className="text-3xl font-bold text-center mb-8">HLS Platform Terms and Conditions</h1>
                
                <div className="prose max-w-none">
                    {/* 1. Introduction */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">1. Introduction</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">1.1 Purpose</h3>
                            <p className="mb-4">
                                These Terms and Conditions govern the use of the HLS platform by Principals, Affiliates, and other users. By accessing or using the platform, you agree to comply with these terms.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">1.2 Acceptance of Terms</h3>
                            <p className="mb-4">
                                Continued use of the platform constitutes acceptance of these terms. If you do not agree, you must cease usage immediately.
                            </p>
                        </div>
                    </section>

                    {/* 2. Account Registration and Management */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">2. Account Registration and Management</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">2.1 Eligibility</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Principals must meet HLS's eligibility criteria.</li>
                                <li className="mb-2">Users must provide accurate and complete registration details.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">2.2 Account Security</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Users are responsible for maintaining account confidentiality.</li>
                                <li className="mb-2">Notify HLS immediately of unauthorized access.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">2.3 Account Termination</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Users may voluntarily deactivate accounts following the <span className="font-semibold">Designated Account Closure Procedure</span>.</li>
                                <li className="mb-2">HLS reserves the right to suspend or terminate accounts for violations.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">2.4 Post-Termination Obligations</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Sponsored Benfeks remain on the platform.</li>
                                <li className="mb-2">Non-withdrawable funds remain subject to platform policies.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. Wallet and Withdrawal Policy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">3. Wallet and Withdrawal Policy</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">3.1 Withdrawal Access</h3>
                            <p className="mb-4">
                                Funds may be withdrawn into registered bank accounts.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">3.2 Withdrawal Limits</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2"><span className="font-semibold">Monthly Limit:</span> One (1) withdrawal per calendar month.</li>
                                <li className="mb-2"><span className="font-semibold">Bonus Withdrawal Slot:</span> A second withdrawal is granted if the Principal follows HLS on LinkedIn within two (2) months of registration.</li>
                                <li className="mb-2"><span className="font-semibold">Additional Privilege:</span> A third withdrawal is available after sponsoring ten (10) Benfeks.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">3.3 Wallet Crediting</h3>
                            <p className="mb-2">Earnings are credited after deductions:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">30% commission to HLS</li>
                                <li className="mb-2">5% administrative charge</li>
                                <li className="mb-2">7.5% VAT</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">3.4 Non-Withdrawable Funds</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">5% of each transaction is non-withdrawable for 12 months.</li>
                                <li className="mb-2">These funds can be used for:
                                    <ul className="list-circle pl-6 mt-2">
                                        <li className="mb-1">Accessing transaction records</li>
                                        <li className="mb-1">Acquiring GZ Points</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. Payment and Transaction Policies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">4. Payment and Transaction Policies</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">4.1 Payment Errors</h3>
                            <p className="mb-4">
                                Failed transactions due to insufficient funds, incorrect details, or gateway issues will trigger an in-platform alert. Users must ensure accurate payment details.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">4.2 Auto-Reversal & Refunds</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Wait 24–72 hours for automatic reversal.</li>
                                <li className="mb-2">Contact HLS support with proof for unresolved issues.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">4.3 Transaction Confirmation</h3>
                            <p className="mb-4">
                                Services are confirmed only upon successful payment.
                            </p>
                        </div>
                    </section>

                    {/* 5. Data Protection and Privacy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">5. Data Protection and Privacy</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">5.1 Commitment to Privacy</h3>
                            <p className="mb-4">
                                HLS complies with the <span className="font-semibold">Nigeria Data Protection Act (NDPA) 2023</span>.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">5.2 Data Collection & Use</h3>
                            <p className="mb-2">Personal data (name, contact info, health records) is collected for:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Service delivery</li>
                                <li className="mb-2">Regulatory compliance</li>
                                <li className="mb-2">Platform improvements</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">5.3 User Rights</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Access, correct, or delete personal data (subject to legal retention).</li>
                                <li className="mb-2">Withdraw consent at any time.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">5.4 Data Security</h3>
                            <p className="mb-4">
                                Encryption, access controls, and secure servers protect user data.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">5.5 Breach Notification</h3>
                            <p className="mb-4">
                                HLS will notify affected users and authorities in case of a data breach.
                            </p>
                        </div>
                    </section>

                    {/* 6. Dispute Resolution */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">6. Dispute Resolution</h2>
                        <div className="pl-4">
                            <h3 className="text-xl font-semibold mb-2">6.1 Informal Resolution</h3>
                            <p className="mb-4">
                                Contact support at <span className="font-semibold">support@hlsnigeria.com.ng</span> within 5 business days.
                            </p>
                            
                            <h3 className="text-xl font-semibold mb-2">6.2 Mediation & Arbitration</h3>
                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">Unresolved disputes go to mediation (Lagos, Nigeria).</li>
                                <li className="mb-2">If mediation fails, binding arbitration applies under the <span className="font-semibold">Arbitration and Mediation Act, 2023</span>.</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold mb-2">6.3 Governing Law</h3>
                            <p className="mb-4">
                                Nigerian law governs all disputes.
                            </p>
                        </div>
                    </section>

                    {/* 7. Platform Modifications & Updates */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 underline">7. Platform Modifications & Updates</h2>
                        <p className="mb-4">
                            HLS may update terms quarterly. Continued use after updates constitutes acceptance.
                        </p>
                    </section>

                   

                    {/* Contact Information */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 underline">Contact Information</h2>
                        <p>
                            For questions about these Terms and Conditions, please contact us at <span className="font-semibold">support@hlsnigeria.com.ng</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
