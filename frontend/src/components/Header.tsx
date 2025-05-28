import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await Auth.signOut();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Secure File App</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
                Log out
            </button>
        </header>
    );
};

export default Header;
