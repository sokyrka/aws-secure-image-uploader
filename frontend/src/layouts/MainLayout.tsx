import React from 'react';
import Header from '../components/Header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
);

export default MainLayout;
