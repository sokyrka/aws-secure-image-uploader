import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';

const App = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(() => setAuthenticated(true))
            .catch(() => setAuthenticated(false))
            .finally(() => setLoading(false));
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading...
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={authenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={authenticated ? <Navigate to="/dashboard" /> : <Register />} />
            <Route
                path="/dashboard"
                element={
                    authenticated ? (
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route path="*" element={<Navigate to={authenticated ? "/dashboard" : "/login"} />} />
        </Routes>
    );
};

export default App;
