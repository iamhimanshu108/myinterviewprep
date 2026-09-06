import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/flows/:topicId" element={<DashboardLayout />} />
        <Route path="/questions/:stackId" element={<DashboardLayout />} />
        <Route path="/practice" element={<DashboardLayout />} />
        <Route path="/practice/:stackId" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
