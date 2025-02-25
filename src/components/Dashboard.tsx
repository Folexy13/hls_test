import { useNavigate } from "react-router-dom";
import {
  User,
  RefreshCcw,
  Power,
  History,
  TrendingUp,
  Wallet,
  Users,
  ShoppingCart,
  UserPlus,
  Pill,
  Newspaper,
  Mic,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api, apiBaseUrl } from "../service/apiService";
import { jwtDecode } from "jwt-decode";
import { Dropdown, Menu } from "antd"; // Import Dropdown and Menu components
import { DownOutlined } from "@ant-design/icons"; // Import DownOutlined icon for dropdown indicator


function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [pharmacy, setPharmacy] = useState("");

  useEffect(() => {
    const fetchWalletbalance = async () => {
      const resp = await api.get(apiBaseUrl + "/wallet/balance/");
      setBalance(resp.data.balance);
    };
    fetchWalletbalance();
  }, []);

  useEffect(() => {
    // Get the auth token from localStorage
    const authToken = localStorage.getItem("authToken")??"";
    if (authToken){
      // Decode the token
    const decoded: { user_id: string } = jwtDecode(authToken);

    // Extract user ID from the decoded token
    const userId = decoded.user_id;
    const fetchPharmacyname = async () => {
      const resp = await api.get(apiBaseUrl + "/customers/id/" + userId + "/");
      setPharmacy(resp.data.name);
    };
    fetchPharmacyname();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }

  // Menu for dropdown options
  const menu = (
      <Menu>
        <Menu.Item key="profile" onClick={() => navigate("/profile")}>
          Edit Profile
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
  );


  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 sm:block flex items-center justify-center">
      <div className="md:max-w-7xl w-11/12 mx-auto bg-white rounded-xl shadow-lg">
        {/* Dashboard screen */}
        <section className="p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              {/* User icon dropdown */}
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="flex items-center cursor-pointer">
                  <User className="w-6 h-6 sm:w-7 sm:h-7" />
                  <DownOutlined className="ml-1 w-4 h-4" /> {/* Down arrow to indicate dropdown */}
                </div>
              </Dropdown>
            </div>
            <div className="flex gap-3">
              <Power
                className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-2 font-bold mb-1">
             <span> {balance.toPrecision(3)}</span>
              <RefreshCcw className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" xlinkTitle="refresh dashboard" />
              <span></span>
            </h1>
            <p className="text-blue-100 text-sm">{pharmacy}</p>
          </div>
        </section>

        {/* Wallet section */}
        <section className="p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Wallet</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: History, label: "Account", path: "/account" },
              { icon: TrendingUp, label: "Earnings", path: "/earnings" },
              { icon: Wallet, label: "Withdraw", path: "/withdraw" },
            ].map(({ icon: Icon, label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex flex-col items-center"
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-gray-700 text-xs sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Directory section */}
        <section className="p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Directory</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Users, label: "Benfeks", path: "/benfeks" },
              { icon: ShoppingCart, label: "Purchases", path: "/purchases" },
              { icon: UserPlus, label: "Add benfek", path: "/add-benfek" },
            ].map(({ icon: Icon, label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex flex-col items-center"
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-gray-700 text-xs sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Publish section */}
        <section className="p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Publish</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Pill, label: "Supplements", path: "/supplements" },
              { icon: Newspaper, label: "Articles", path: "/articles" },
              { icon: Mic, label: "Podcasts", path: "/podcasts" },
            ].map(({ icon: Icon, label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex flex-col items-center"
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-gray-700 text-xs sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
