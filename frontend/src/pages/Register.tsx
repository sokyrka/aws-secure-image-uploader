import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await Auth.signUp({ username: email, password });
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleRegister} className="p-4 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">Register</h2>
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
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
        </form>
    );
};

export default Register;
