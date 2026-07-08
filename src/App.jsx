import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';

// Lazy load layout wrapper
const Layout = lazy(() => import('./components/Layout'));

// Lazy load all routing screen components
const SignUp = lazy(() => import('./SignUp'));
const Login = lazy(() => import('./Login'));
const HomePage = lazy(() => import('./Home'));
const Logout = lazy(() => import('./logout'));

// Customer routes
const Customersignup = lazy(() => import('./screens_customers/customersignup'));
const CustomerView = lazy(() => import('./screens_customers/cus_view'));
const CustomerDetails = lazy(() => import('./screens_customers/CustomerDetails'));
const CustomersTaxAssessment = lazy(() => import('./screens_customers/tax_assesment'));
const CustomerListforTax = lazy(() => import('./screens_customers/customer_list_fortax'));
const CreateTaxAssessment = lazy(() => import('./screens_customers/customer_create_tax_assesment'));
const UpdateTaxAssessment = lazy(() => import('./screens_customers/customer_update_tax_assesment'));
const ListTaxAssessments = lazy(() => import('./screens_customers/customer_tax_list'));
const CustomerListForNotice = lazy(() => import('./screens_customers/customer_list_for_notice'));
const CustomersNoticeAssessment = lazy(() => import('./screens_customers/notice_assesements'));
const CreateITNotice = lazy(() => import('./screens_customers/create_it_notice'));
const ITNoticeList = lazy(() => import('./screens_customers/it_notice_list'));
const EditITNotice = lazy(() => import('./screens_customers/edit_it_notice'));

// Business routes
const BusinessSignup = lazy(() => import('./screens_bussiness/business-signup'));
const BusinessList = lazy(() => import('./screens_bussiness/business_list'));
const BusinessDetails = lazy(() => import('./screens_bussiness/businessDetails'));
const BusinessTaxAssessment = lazy(() => import('./screens_bussiness/tax_assesment'));
const BusinessListforTax = lazy(() => import('./screens_bussiness/business_list_for_tax'));
const BusinessTaxCreate = lazy(() => import('./screens_bussiness/create_tax_assesement'));
const BusinessListOfTaxAssessments = lazy(() => import('./screens_bussiness/list_of_tax_assesments'));
const BusinessUpdateTaxAssessment = lazy(() => import('./screens_bussiness/update_tax_assesment'));
const BusinessListForNotice = lazy(() => import('./screens_bussiness/business_list_for_notice'));
const BusinessNotices = lazy(() => import('./screens_bussiness/business_notices'));
const CreateBusItNotice = lazy(() => import('./screens_bussiness/create_it_notice'));
const BusITNoticeList = lazy(() => import('./screens_bussiness/it_notice_lists'));
const UpdateBusITNotice = lazy(() => import('./screens_bussiness/update_bus_it_notice'));

// Audit User routes
const AuditHome = lazy(() => import('./users_routes/audit_users/home'));
const MessageCentre = lazy(() => import('./MessageCentre'));
const TransactionHistory = lazy(() => import('./TransactionHistory'));

const App = () => {
    return (
        <Router>
            <Suspense fallback={<Loader message="Initializing EasyAudit..." />}>
                <Routes>
                    {/* Public & Authentication paths */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />

                    {/* Secure routes inside collapsible Sidebar Layout frame */}
                    <Route element={<Layout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path='/home-audit' element={<AuditHome />} />
                        <Route path="/messages" element={<MessageCentre />} />
                        <Route path="/transactions" element={<TransactionHistory />} />

                        {/* Customer Signup routes */}
                        <Route path='/customer-signup' element={<Customersignup />} />
                        <Route path='/customers' element={<CustomerView />} />
                        <Route path="/customer/:id" element={<CustomerDetails />} />
                        
                        {/* Customers Tax Assessments routes */}
                        <Route path='/tax-assesment' element={<CustomersTaxAssessment />} />
                        <Route path="/create-tax-assessment/:id" element={<CreateTaxAssessment />} />
                        <Route path="/customers_tax" element={<CustomerListforTax />} />
                        <Route path="/update-assessments" element={<ListTaxAssessments />} />
                        <Route path="/update-tax-assessment/:id" element={<UpdateTaxAssessment />} />

                        {/* Customers IT Notices */}
                        <Route path='/notice-assesment' element={<CustomersNoticeAssessment />} />
                        <Route path="/customers-notice" element={<CustomerListForNotice />} />
                        <Route path="/create-it-notice/:id" element={<CreateITNotice />} />
                        <Route path="/notice-list" element={<ITNoticeList />} />
                        <Route path="/edit-it-notice/:id" element={<EditITNotice />} />

                        {/* Business Signup routes */}
                        <Route path='/business-signup' element={<BusinessSignup />} />
                        <Route path='/business-list' element={<BusinessList />} />
                        <Route path='/business-Details/:id' element={<BusinessDetails />} />

                        {/* Business Tax Assessments */}
                        <Route path='/business-tax-assessments' element={<BusinessTaxAssessment />} />
                        <Route path='/business-list-for-tax' element={<BusinessListforTax />} />
                        <Route path='/create-tax-business/:id' element={<BusinessTaxCreate />} />
                        <Route path='/business-list-of-tax-assessments' element={<BusinessListOfTaxAssessments />} />
                        <Route path='/update-bus-tax-assessment/:id' element={<BusinessUpdateTaxAssessment />} />

                        {/* Business IT Notices */}
                        <Route path='/business-notices' element={<BusinessNotices />} />
                        <Route path='/business-list-for-notice' element={<BusinessListForNotice />} />
                        <Route path='/create-bus-it-notice/:id' element={<CreateBusItNotice />} />
                        <Route path='/busITNoticeList' element={<BusITNoticeList/>} />
                        <Route path='/update-bus-it-notice/:id' element={<UpdateBusITNotice />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
