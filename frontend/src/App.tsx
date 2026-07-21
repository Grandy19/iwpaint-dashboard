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
import { DistributorTargetSalesPage } from './pages/distributor/DistributorTargetSalesPage';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthenticatorPage } from './pages/auth/AuthenticatorPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/authenticator" element={<AuthenticatorPage />} />

          {/* Admin Routes */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute><CustomerPage /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
          <Route path="/import" element={<ProtectedRoute><ImportDataPage /></ProtectedRoute>} />
          <Route path="/target-sales" element={<ProtectedRoute><TargetSalesPage /></ProtectedRoute>} />
          <Route path="/supervisor" element={<ProtectedRoute><SupervisorPage /></ProtectedRoute>} />
          <Route path="/distributor" element={<ProtectedRoute><KepalaDistributorPage /></ProtectedRoute>} />
          
          {/* Sales Dashboard Routes */}
          <Route path="/sales-dashboard" element={<ProtectedRoute><SalesDashboardPage /></ProtectedRoute>} />
          <Route path="/sales-dashboard/customer" element={<ProtectedRoute><SalesCustomerPage /></ProtectedRoute>} />
          <Route path="/sales-dashboard/target" element={<ProtectedRoute><SalesTargetPage /></ProtectedRoute>} />

          {/* Supervisor Dashboard Routes */}
          <Route path="/supervisor-dashboard" element={<ProtectedRoute><SupervisorDashboardPage /></ProtectedRoute>} />
          <Route path="/supervisor-dashboard/sales" element={<ProtectedRoute><SupervisorSalesPage /></ProtectedRoute>} />
          <Route path="/supervisor-dashboard/customer" element={<ProtectedRoute><SupervisorCustomerPage /></ProtectedRoute>} />
          <Route path="/supervisor-dashboard/target-sales" element={<ProtectedRoute><SupervisorTargetPage /></ProtectedRoute>} />

          {/* Distributor Dashboard Routes */}
          <Route path="/distributor-dashboard" element={<ProtectedRoute><DistributorDashboardPage /></ProtectedRoute>} />
          <Route path="/distributor-dashboard/supervisor" element={<ProtectedRoute><DistributorSupervisorPage /></ProtectedRoute>} />
          <Route path="/distributor-dashboard/sales" element={<ProtectedRoute><DistributorSalesPage /></ProtectedRoute>} />
          <Route path="/distributor-dashboard/customer" element={<ProtectedRoute><DistributorCustomerPage /></ProtectedRoute>} />
          <Route path="/distributor-dashboard/target-sales" element={<ProtectedRoute><DistributorTargetSalesPage /></ProtectedRoute>} />

          <Route path="*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
