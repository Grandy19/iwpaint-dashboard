import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ImportDataPage } from './pages/admin/ImportDataPage';
import { CustomerPage } from './pages/admin/CustomerPage';
import { SalesPage } from './pages/admin/SalesPage';

import { TargetSalesPage } from './pages/admin/TargetSalesPage';
import { SupervisorPage } from './pages/admin/SupervisorPage';
import { KepalaDistributorPage } from './pages/admin/KepalaDistributorPage';

import { SalesDashboardPage } from './pages/sales/SalesDashboardPage';
import { SalesCustomerPage } from './pages/sales/SalesCustomerPage';
import { SalesTargetPage } from './pages/sales/SalesTargetPage';

import { SupervisorDashboardPage } from './pages/supervisor/SupervisorDashboardPage';
import { SupervisorSalesPage } from './pages/supervisor/SupervisorSalesPage';
import { SupervisorCustomerPage } from './pages/supervisor/SupervisorCustomerPage';
import { SupervisorTargetPage } from './pages/supervisor/SupervisorTargetPage';

import { DistributorDashboardPage } from './pages/distributor/DistributorDashboardPage';
import { DistributorSupervisorPage } from './pages/distributor/DistributorSupervisorPage';
import { DistributorSalesPage } from './pages/distributor/DistributorSalesPage';
import { DistributorCustomerPage } from './pages/distributor/DistributorCustomerPage';

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
        
        {/* Sales Dashboard Routes */}
        <Route path="/sales-dashboard" element={<SalesDashboardPage />} />
        <Route path="/sales-dashboard/customer" element={<SalesCustomerPage />} />
        <Route path="/sales-dashboard/target" element={<SalesTargetPage />} />

        {/* Supervisor Dashboard Routes */}
        <Route path="/supervisor-dashboard" element={<SupervisorDashboardPage />} />
        <Route path="/supervisor-dashboard/sales" element={<SupervisorSalesPage />} />
        <Route path="/supervisor-dashboard/customer" element={<SupervisorCustomerPage />} />
        <Route path="/supervisor-dashboard/target-sales" element={<SupervisorTargetPage />} />

        {/* Distributor Dashboard Routes */}
        <Route path="/distributor-dashboard" element={<DistributorDashboardPage />} />
        <Route path="/distributor-dashboard/supervisor" element={<DistributorSupervisorPage />} />
        <Route path="/distributor-dashboard/sales" element={<DistributorSalesPage />} />
        <Route path="/distributor-dashboard/customer" element={<DistributorCustomerPage />} />

        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
