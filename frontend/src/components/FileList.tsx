import { useEffect, useState } from 'react';
import { getFileList, deleteFile, getDownloadUrl } from '../services/Api';
import { notifyError, notifySuccess } from '../utils/Toast';

const FileList = () => {
    const [files, setFiles] = useState<string[]>([]);

    const fetchFiles = async () => {
        const list = await getFileList();
        setFiles(list);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDelete = async (key: string) => {
        try {
            await deleteFile(key);
            fetchFiles();
            notifySuccess('File deleted');
        } catch (error) {
            notifyError('Delete failed');
        }
        await deleteFile(key);
        fetchFiles();
    };

    const handleDownload = async (key: string) => {
        const url = await getDownloadUrl(key);
        window.open(url, '_blank');
    };

    return (
        <div className="mt-6 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Your Files</h2>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <ul className="space-y-2">
                    {files.map((key) => (
                        <li key={key} className="flex justify-between items-center border-b py-1">
                            <span className="truncate max-w-xs">{key}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownload(key)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => handleDelete(key)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileList;
