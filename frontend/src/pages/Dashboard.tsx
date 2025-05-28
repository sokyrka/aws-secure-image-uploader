import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';

const Dashboard = () => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <FileUploader onUpload={() => window.location.reload()} />
            <FileList />
        </>
    );
};

export default Dashboard;
