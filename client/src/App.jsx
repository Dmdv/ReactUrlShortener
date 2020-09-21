import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'materialize-css'
import './App.css';
import { AuthContext } from "./context/AuthContext";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";

function App() {
  const { token, login, logout, userId } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  return (
    <AuthContext.Provider value={{
      token: token,
      login: login,
      logout: logout,
      userId: userId,
      isAuthenticated: isAuthenticated
    }}>
      <Router>
        {routes}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
