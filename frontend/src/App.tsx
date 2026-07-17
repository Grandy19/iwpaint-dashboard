import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ImportDataPage } from './pages/admin/ImportDataPage';
import { CustomerPage } from './pages/admin/CustomerPage';
import { SalesPage } from './pages/admin/SalesPage';

import { TargetSalesPage } from './pages/admin/TargetSalesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/import" element={<ImportDataPage />} />
        <Route path="/target-sales" element={<TargetSalesPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
