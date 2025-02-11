import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react"; // Import eye icons
import { endpoint } from "../service/actions";
import { notification } from "antd";

// Import Ant Design icons
import { PhoneOutlined, HomeOutlined, BankFilled } from "@ant-design/icons";
import axios from "axios";

function Auth() {
  const [username, setUsername] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setaccountNumber] = useState("");
  const [retypePassword, setRetypePassword] = useState(""); // New state for retype password
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility toggle
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false); // State for retype password visibility toggle
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const navigate = useNavigate();

  
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
            { headers: { Authorization: `Bearer sk_test_accd9e759dcf29e72d8ed562fa0d972265e5861a` } }
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

    if (password !== retypePassword && !isLogin) {
      notification.error({ message: "Passwords do not match." });
      return;
    }


    try {
      if (isLogin) {
        // Call the loginUser method to authenticate the user
        await endpoint.loginUser(username, password);
        notification.success({ message: "Login successful." });
        navigate("/dashboard");
      } else {
        // Call the registerUser method to create a new account
        await endpoint.registerUser(
          username,
          password,
          "principal",
          pharmacyName, // Send pharmacy name for registration
          accountNumber,
          selectedBank,
          pharmacyAddress, // Send pharmacy address for registration
          phone // Send phone for registration
        );

        notification.success({
          message: "Registration successful. Please log in.",
        });
        setIsLogin(true);
      }
      navigate("/dashboard");
    } catch (err: any) {
      notification.error({
        message: err.response.data.error || err.message || "An error occurred",
      });
      console.error("Error:", err.response.data.error);
    }
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
          <img src={"logo"} alt="Logo" className="w-16 h-16 mx-auto mb-4" />

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
              <User className="h-5 w-5 text-gray-400" />
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
                  <HomeOutlined className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pharmacy Name"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HomeOutlined className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={pharmacyAddress}
                  onChange={(e) => setPharmacyAddress(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pharmacy Address"
                  // required
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
                  <BankFilled className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setaccountNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Account Number"
                  onBlur={resolveAccount}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BankFilled className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={accountName}
                  readOnly
                  className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  placeholder="Account Name"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneOutlined className="h-5 w-5 text-gray-400" />
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
              <Lock className="h-5 w-5 text-gray-400" />
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
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Retype Password field */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
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
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isLogin ? "login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {isLogin ? "Register" : "login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
