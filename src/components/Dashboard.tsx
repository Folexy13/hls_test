
import { useNavigate } from 'react-router-dom';
import {
  User,
  Menu,
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
  Mic
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 sm:block flex items-center justify-center">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Dashboard screen */}
        <section className="p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <User className="w-6 h-6 sm:w-7 sm:h-7 hidden sm:block" />
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 hidden sm:block" />
            </div>
            <div className="flex gap-3">
              <RefreshCcw className="w-6 h-6 sm:w-7 sm:h-7 hidden sm:block" />
              <Power className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" onClick={() => navigate('/login')} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">₦50,000</h1>
            <p className="text-blue-100 text-sm">Fullmoon Pharmacy</p>
          </div>
        </section>

        {/* Wallet section */}
        <section className="p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Wallet</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div onClick={() => navigate('/account')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <History className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Account</span>
              </div>
            </div>
            <div onClick={() => navigate('/earnings')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Earnings</span>
              </div>
            </div>
            <div onClick={() => navigate('/withdraw')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Withdraw</span>
              </div>
            </div>
          </div>
        </section>

        {/* Directory section */}
        <section className="p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Directory</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div onClick={() => navigate('/benfeks')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Benfeks</span>
              </div>
            </div>
            <div onClick={() => navigate('/purchases')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Purchases</span>
              </div>
            </div>
            <div onClick={() => navigate('/add-benfek')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Add benfek</span>
              </div>
            </div>
          </div>
        </section>

        {/* Publish section */}
        <section className="p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Publish</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div onClick={() => navigate('/supplements')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Supplements</span>
              </div>
            </div>
            <div onClick={() => navigate('/articles')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Articles</span>
              </div>
            </div>
            <div onClick={() => navigate('/podcasts')} className="cursor-pointer p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
                <span>Podcasts</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
