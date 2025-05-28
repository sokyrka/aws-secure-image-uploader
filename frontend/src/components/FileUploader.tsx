import React, { useState } from 'react';
import { uploadFile } from '../services/Api';
import { notifyError, notifySuccess } from '../utils/Toast';

const FileUploader: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;

        try {
            await uploadFile(file);
            setFile(null);
            notifySuccess('File uploaded');
            onUpload();
        } catch (error) {
            notifyError('Upload failed');
        }
    };

    return (
        <div className="bg-white rounded p-4 shadow flex gap-2 items-center">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button
                onClick={handleUpload}
                disabled={!file}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Upload
            </button>
        </div>
    );
};

export default FileUploader;
