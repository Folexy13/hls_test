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

// Private Route Component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  const authToken = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        {/* Redirect to login if no token, otherwise go to dashboard */}
        <Route path="/" element={<Navigate to={authToken ? "/dashboard" : "/login"} />} />

        {/* Login page should not be accessible if logged in */}
        <Route path="/login" element={authToken ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
        <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
        <Route path="/benfeks" element={<PrivateRoute><Benfeks /></PrivateRoute>} />
        <Route path="/purchases" element={<PrivateRoute><Purchases /></PrivateRoute>} />
        <Route path="/add-benfek" element={<PrivateRoute><AddBenfek /></PrivateRoute>} />
        <Route path="/supplements" element={<PrivateRoute><Supplements /></PrivateRoute>} />
        <Route path="/articles" element={<PrivateRoute><Articles /></PrivateRoute>} />
        <Route path="/podcasts" element={<PrivateRoute><Podcasts /></PrivateRoute>} />

        {/* Catch-all route: If user visits an unknown route, redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
