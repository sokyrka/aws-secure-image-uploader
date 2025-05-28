import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const loadFiles = async (token: string) => {
        const res = await axios.get(`${import.meta.env.API_BASE_URL}/files`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setFiles(res.data.files);
    };

    const handleUpload = async () => {
        if (!file) return;
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const res = await axios.get(`${import.meta.env.API_BASE_URL}/upload-url?filename=${encodeURIComponent(file.name)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        await axios.put(res.data.uploadUrl, file);
        await loadFiles(token);
    };

    const handleDelete = async (key: string) => {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        await axios.delete(`${import.meta.env.API_BASE_URL}/delete/file?key=${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        await loadFiles(token);
    };

    const handleDownload = async (key: string) => {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const res = await axios.get(`${import.meta.env.API_BASE_URL}/download/file?key=${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        window.open(res.data.downloadUrl, '_blank');
    };

    const handleLogout = async () => {
        await Auth.signOut();
        navigate('/login');
    };

    useEffect(() => {
        Auth.currentSession()
            .then(session => loadFiles(session.getIdToken().getJwtToken()))
            .catch(() => navigate('/login'));
    }, []);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>

            <div className="mb-4 flex items-center space-x-2">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
                <button onClick={handleLogout} className="ml-auto bg-gray-400 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <ul className="space-y-2">
                {files.map(key => (
                    <li key={key} className="flex justify-between items-center border p-2 rounded">
                        <span className="truncate max-w-xs">{key}</span>
                        <div className="space-x-2">
                            <button onClick={() => handleDownload(key)} className="text-blue-600">Download</button>
                            <button onClick={() => handleDelete(key)} className="text-red-600">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
