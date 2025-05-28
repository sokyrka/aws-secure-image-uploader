import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError("Passwords don't match");
            return;
        }

        try {
            await Auth.signUp({
                username: form.username,
                password: form.password,
                attributes: { email: form.username },
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && (
                    <p className="text-green-600 mb-4">
                        Account created. Check your email to confirm.
                    </p>
                )}

                <input
                    name="username"
                    placeholder="Email"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded mb-4"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded mb-4"
                    required
                />
                <input
                    name="confirm"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded mb-6"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Register
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
