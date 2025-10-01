import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/auth/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';

import EnquiryList from './components/enquiry/EnquiryList';
import EnquiryDetail from './components/enquiry/EnquiryDetail_clean';
import NewEnquiry from './components/enquiry/NewEnquiry';

import BudgetList from './components/budget/BudgetList';
import BudgetCreateEdit from './components/budget/BudgetCreateEdit';
import BudgetView from './components/budget/BudgetView';
import BudgetManagerView from './components/budget/BudgetManagerView';
import BudgetApproval from './components/budget/BudgetApproval';

import QuotationList from './components/quotation/QuotationList';
import QuotationCreateEdit from './components/quotation/QuotationCreateEdit';

import ReceivedOrderList from './components/orders/ReceivedOrderList';
import ReceivedOrderForm from './components/orders/ReceivedOrderForm';

import SalesOrderList from './components/orders/SalesOrderList';
import SalesOrderForm from './components/orders/SalesOrderForm';
import CreateNewSaleOrder from './components/orders/CreateNewSaleOrder';
import ViewSalesOrder from './components/orders/ViewSalesOrder';

// FPO module removed
// import FPOList from './components/fpo/FPOList';
// import FPOForm from './components/fpo/FPOForm';
// OrderManagement submodule removed per user request
import InventoryManagement from './components/inventory/InventoryManagement';
import ConfirmOrderNew from './components/orders/ConfirmOrderNew';
import OrderManagement from './components/orders/OrderManagement';
import CheckInProcess from './components/checkin/CheckInProcess';
import InvoiceList from './components/invoice/InvoiceList';
import FPOList from './components/fpo/FPOList';
import FPOForm from './components/fpo/FPOForm';
import PurchaseOrderList from './components/purchase/PurchaseOrderList';

// inward/issuance/invoice modules removed per user request

import InventoryBlockingList from './components/inventory/InventoryBlockingList';
import InventoryBlockDetails from './components/inventory/InventoryBlockDetails';
import TermsAndConditions from './components/settings/TermsAndConditions';
import CheckInList from './components/checkin/CheckInList';

import AuditTrail from './components/audit/AuditTrail';
import Settings from './components/settings/Settings';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ReceivedOrdersProvider } from './context/ReceivedOrdersContext';
import { SalesOrdersProvider } from './context/SalesOrdersContext';
import { BudgetProvider } from './context/BudgetContext';
import NotFoundPage from './components/system/NotFoundPage';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/enquiries" element={<EnquiryList />} />
        <Route path="/enquiries/new" element={<NewEnquiry />} />
        <Route path="/enquiries/:id" element={<EnquiryDetail />} />

        <Route path="/budgets" element={<BudgetList />} />
        <Route path="/budget/new" element={<BudgetCreateEdit />} />
        <Route path="/budget/:id/view" element={
          user.role === 'Manager' ? <BudgetManagerView /> : <BudgetView />
        } />
        <Route path="/budget/:id/edit" element={<BudgetCreateEdit />} />
        <Route path="/budget/:id/approve" element={<BudgetApproval />} />

        <Route path="/quotations" element={<QuotationList />} />
        <Route path="/quotations/new" element={<QuotationCreateEdit />} />
        <Route path="/quotations/:id" element={<QuotationCreateEdit />} />

        <Route path="/received-orders" element={<ReceivedOrderList />} />
        <Route path="/received-orders/new" element={<ReceivedOrderForm />} />
        <Route path="/received-orders/edit/:id" element={<ReceivedOrderForm />} />

        <Route path="/sales-orders" element={<SalesOrderList />} />
        <Route path="/sales-orders/new" element={<CreateNewSaleOrder />} />
        <Route path="/sales-orders/view/:id" element={<ViewSalesOrder />} />
        <Route path="/sales-orders/:id" element={<SalesOrderForm />} />

        <Route path="/blocking" element={<InventoryBlockingList />} />
        <Route path="/blocking/:id" element={<InventoryBlockDetails />} />

        <Route path="/checkin" element={<CheckInList />} />

        <Route path="/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="/purchase-orders/new" element={<PurchaseOrderList />} />

        {/* FPO routes restored */}
        <Route path="/fpo" element={<FPOList />} />
        <Route path="/fpo/new" element={<FPOForm />} />
        <Route path="/fpo/:id" element={<FPOForm />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/confirm-orders" element={<ConfirmOrderNew />} />
        <Route path="/check-in-process" element={<CheckInProcess />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/invoices" element={<InvoiceList />} />

        {/* Inward / Issuance / Invoices removed */}

        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/audit-trail" element={<AuditTrail />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ReceivedOrdersProvider>
          <SalesOrdersProvider>
            <BudgetProvider>
              <Router>
                <AppRoutes />
              </Router>
            </BudgetProvider>
          </SalesOrdersProvider>
        </ReceivedOrdersProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
