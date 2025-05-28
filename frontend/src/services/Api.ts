import axios from 'axios';
import { Auth } from 'aws-amplify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeaders = async () => {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    return { Authorization: token };
};

export const uploadFile = async (file: File): Promise<void> => {
    const headers = await getAuthHeaders();

    const filename = encodeURIComponent(file.name);
    const res = await axios.get(`${API_BASE}/upload-url?filename=${filename}`, { headers });
    const { uploadUrl } = res.data;

    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};

export const getFileList = async (): Promise<string[]> => {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE}/files`, { headers });
    return res.data.files;
};

export const getDownloadUrl = async (key: string): Promise<string> => {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE}/download/file`, {
        headers,
        params: { key },
    });
    return res.data.downloadUrl;
};

export const deleteFile = async (key: string): Promise<void> => {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_BASE}/delete/file`, {
        headers,
        params: { key },
    });
};
