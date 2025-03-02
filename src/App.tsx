import { BrowserRouter as Router, Routes, Route, Navigate,createBrowserRouter ,RouterProvider} from 'react-router-dom';
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={localStorage.getItem("authToken") ? "/dashboard" : "/login"} />,
  },
  {
    path: "/login",
    element: localStorage.getItem("authToken") ? <Navigate to="/dashboard" /> : <Login />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: "/account",
    element: <PrivateRoute><Account /></PrivateRoute>,
  },
  {
    path: "/earnings",
    element: <PrivateRoute><Earnings /></PrivateRoute>,
  },
  {
    path: "/withdraw",
    element: <PrivateRoute><Withdraw /></PrivateRoute>,
  },
  {
    path: "/benfeks",
    element: <PrivateRoute><Benfeks /></PrivateRoute>,
  },
  {
    path: "/purchases",
    element: <PrivateRoute><Purchases /></PrivateRoute>,
  },
  {
    path: "/add-benfek",
    element: <PrivateRoute><AddBenfek /></PrivateRoute>,
  },
  {
    path: "/supplements",
    element: <PrivateRoute><Supplements /></PrivateRoute>,
  },
  {
    path: "/articles",
    element: <PrivateRoute><Articles /></PrivateRoute>,
  },
  {
    path: "/podcasts",
    element: <PrivateRoute><Podcasts /></PrivateRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);
function App() {
  // const authToken = localStorage.getItem('authToken');

  return <RouterProvider router={router}/>;
}

export default App;
