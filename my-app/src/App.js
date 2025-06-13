import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginForm';
import Dashboard from './Components/DashBorad';
import Purchases from './Components/Purchases';
import Transfers from './Components/Transfers';
import Assignments from './Components/Assignments';
import Expenditures from './Components/Expenditures';
import NavBar from './Components/NavBar';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><NavBar /><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/purchases"
          element={<PrivateRoute><NavBar /><Purchases /></PrivateRoute>}
        />
        <Route
          path="/transfers"
          element={<PrivateRoute><NavBar /><Transfers /></PrivateRoute>}
        />
        <Route
          path="/assignments"
          element={<PrivateRoute><NavBar /><Assignments /></PrivateRoute>}
        />
        <Route
          path="/expenditures"
          element={<PrivateRoute><NavBar /><Expenditures /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
