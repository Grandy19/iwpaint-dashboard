import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ImportDataPage } from './pages/ImportDataPage';
import { CustomerPage } from './pages/CustomerPage';
import { SalesPage } from './pages/SalesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/import" element={<ImportDataPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
