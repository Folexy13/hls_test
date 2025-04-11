import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Eye, EyeOff, Lock, User} from "lucide-react"; // Import eye icons
import {endpoint} from "../service/actions";
import {notification} from "antd";
import logo from "../assets/logo.jpg";

// Import Ant Design icons
import {BankFilled, HomeOutlined, PhoneOutlined} from "@ant-design/icons";
import axios from "axios";

function Auth() {
    const [username, setUsername] = useState("");
    const [pharmacyName, setPharmacyName] = useState("");
    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [retypePassword, setRetypePassword] = useState(""); // New state for retype password
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility toggle
    const [retypePasswordVisible, setRetypePasswordVisible] = useState(false); // State for retype password visibility toggle
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for login/register button
    const navigate = useNavigate();
    const [isMedicalProfessional, setIsMedicalProfessional] = useState(true);
    const [isPharmacy, setIsPharmacy] = useState(false);
    const [medicalField, setMedicalField] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false); // State for terms acceptance

    // Fetch all banks on component mount
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await axios.get("https://api.paystack.co/bank", {
                    // headers: { Authorization: `Bearer ${PaystackKey}` },
                });
                setBanks(response.data.data); // Store the list of banks
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };

        fetchBanks();
    }, []);

    // Fetch account name when account number changes
    const resolveAccount = async () => {
        if (accountNumber.length === 10 && selectedBank) {
            try {
                const response = await axios.get(
                    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${selectedBank}`,
                    {headers: {Authorization: `Bearer sk_test_accd9e759dcf29e72d8ed562fa0d972265e5861a`}}
                );
                setAccountName(response.data.data.account_name);
            } catch (error) {
                console.error("Error fetching account name:", error);
                setAccountName("Invalid account details");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && !acceptedTerms) {
            notification.error({message: "You must accept the terms and conditions to register."});
            return;
        }

        if (password !== retypePassword && !isLogin) {
            notification.error({message: "Passwords do not match."});
            return;
        }

        setLoading(true); // Start loading

        try {
            if (isLogin) {
                // Call the loginUser method to authenticate the user
                await endpoint.loginUser(username, password);
                notification.success({message: "Login successful."});
                navigate("/dashboard");
            } else {
                const registrationData = {
                    username,
                    password,
                    role: "principal",
                    name: pharmacyName,
                    account_number: accountNumber,
                    account_name: accountName,
                    bank_name: selectedBank,
                    address: pharmacyAddress,
                    phone,
                    is_medical_professional: true,
                    is_pharmacy: isPharmacy,
                    ...(isMedicalProfessional && {
                        medical_field: medicalField,
                        license_number: licenseNumber,
                        withdrawal_slots: isPharmacy ? 3 : 1 // Set withdrawal slots based on pharmacy status
                    })
                };
                await endpoint.registerUser(registrationData);

                notification.success({
                    message: "Registration successful. Please log in.",
                });
                setIsLogin(true);
            }
            navigate("/dashboard");
        } catch (err: any) {
            notification.error({
                message: err.response?.data?.error || err.message || "An error occurred",
            });
            console.error("Error:", err.response?.data?.error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const openTermsAndConditions = () => {
        // Open terms and conditions in a new tab
        window.open("/terms-and-conditions", "_blank");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "linear-gradient(to bottom right, #1e3a8a, #3b82f6)",
            }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    {/* Add logo above the heading */}
                    <img src={logo} alt="Logo" className=" mx-auto mb-4"/>

                    <h1 className="text-3xl font-bold text-gray-800">
                        {isLogin ? "Welcome Back" : "Create an Account"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isLogin ? "Please login to continue" : "Register to get started"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Username"
                            required
                        />
                    </div>

                    {/* Add additional fields for registration */}
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HomeOutlined className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    value={pharmacyName}
                                    onChange={(e) => setPharmacyName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Principal Name"
                                    required
                                />
                            </div>
                            <div className="flex hidden items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="isMedicalProfessional"
                                    checked={true}
                                    onChange={(e) => {
                                        setIsMedicalProfessional(e.target.checked);
                                        if (!e.target.checked) {
                                            setIsPharmacy(false);
                                            setMedicalField("");
                                            setLicenseNumber("");
                                        }
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isMedicalProfessional" className="ml-2 block text-sm text-gray-700">
                                    Are you a medical professional?
                                </label>
                            </div>

                            {/* Medical Professional Details (shown if checked) */}
                            {isMedicalProfessional && (
                                <>
                                    {/* Medical Field Selection */}
                                    <select
                                        value={medicalField}
                                        onChange={(e) => setMedicalField(e.target.value)}
                                        className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
                                        required={isMedicalProfessional}
                                    >
                                        <option value="">Select Medical Field</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="other">Other Medical Professional</option>
                                    </select>

                                    {/* Pharmacy Radio Buttons - Moved under medical field */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Is this a pharmacy?
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                    checked={isPharmacy === true}
                                                    onChange={() => setIsPharmacy(true)}
                                                />
                                                <span className="ml-2">Yes</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                    checked={isPharmacy === false}
                                                    onChange={() => setIsPharmacy(false)}
                                                />
                                                <span className="ml-2">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* License Number */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            className="block w-full p-2 border border-gray-300 rounded-lg"
                                            placeholder="License Number"
                                            required={isMedicalProfessional}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HomeOutlined className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    value={pharmacyAddress}
                                    onChange={(e) => setPharmacyAddress(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Practising Address"
                                />
                            </div>
                            {/* Select Bank */}
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Bank</option>
                                {banks.map((bank: any) => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BankFilled className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Account Number"
                                    onBlur={resolveAccount}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={accountName}
                                    readOnly
                                    className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                    placeholder="Account Name( it would automatically be filled)"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <PhoneOutlined className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Phone Number"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Password field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Password"
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                <EyeOff className="h-5 w-5 text-gray-400"/>
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400"/>
                            )}
                        </div>
                    </div>

                    {/* Retype Password field */}
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type={retypePasswordVisible ? "text" : "password"}
                                    value={retypePassword}
                                    onChange={(e) => setRetypePassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Retype Password"
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setRetypePasswordVisible(!retypePasswordVisible)}
                                >
                                    {retypePasswordVisible ? (
                                        <EyeOff className="h-5 w-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400"/>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to the{' '}
                                        <button
                                            type="button"
                                            onClick={openTermsAndConditions}
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            terms and conditions
                                        </button>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {isLogin ? "Logging in..." : "Registering..."}
                            </span>
                        ) : (
                            isLogin ? "Login" : "Register"
                        )}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <p>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="bg-red-600 px-6 py-1.5 rounded  text-white hover:text-white-800"
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;