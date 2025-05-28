import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await Auth.signIn(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
        </form>
    );
};

export default Login;
