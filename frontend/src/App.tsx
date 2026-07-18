import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ImportDataPage } from './pages/admin/ImportDataPage';
import { CustomerPage } from './pages/admin/CustomerPage';
import { SalesPage } from './pages/admin/SalesPage';

import { TargetSalesPage } from './pages/admin/TargetSalesPage';
import { SupervisorPage } from './pages/admin/SupervisorPage';
import { KepalaDistributorPage } from './pages/admin/KepalaDistributorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/import" element={<ImportDataPage />} />
        <Route path="/target-sales" element={<TargetSalesPage />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/distributor" element={<KepalaDistributorPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
