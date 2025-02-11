import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Account from './components/Account';
import Earnings from './components/Earnings';
import Withdraw from './components/Withdraw';
import Benfeks from './components/Benfeks';
import Purchases from './components/Purchases';
import AddBenfek from './components/AddBenfek';
import Supplements from './components/Supplements';
import Articles from './components/Articles';
import Podcasts from './components/Podcasts';

function App() {
  const authToken = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        {/* If no authToken, always redirect to dashboard */}
        <Route path="/" element={<Navigate to={authToken ? "/dashboard" : "/login"} />} />

        {/* If logged in, prevent access to login page */}
        <Route path="/login" element={authToken ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/benfeks" element={<Benfeks />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/add-benfek" element={<AddBenfek />} />
        <Route path="/supplements" element={<Supplements />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/podcasts" element={<Podcasts />} />

        {/* Catch-all route: If user visits an unknown route, redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
