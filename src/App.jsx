import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignUp from './SignUp';
import Login from './Login';
import HomePage from './Home';
import Logout from './logout';

import Customersignup from './screens_customers/customersignup';
import CustomerView from './screens_customers/cus_view';
import CustomerDetails from './screens_customers/CustomerDetails';
import CustomersTaxAssessment from './screens_customers/tax_assesment';
import CustomerListforTax from './screens_customers/customer_list_fortax';
import CreateTaxAssessment from './screens_customers/customer_create_tax_assesment';
import UpdateTaxAssessment from './screens_customers/customer_update_tax_assesment';
import ListTaxAssessments from './screens_customers/customer_tax_list';
import CustomerListForNotice from './screens_customers/customer_list_for_notice';
import CustomersNoticeAssessment from './screens_customers/notice_assesements';
import CreateITNotice from './screens_customers/create_it_notice';
import ITNoticeList from './screens_customers/it_notice_list';
import EditITNotice from './screens_customers/edit_it_notice';

import BusinessSignup from './screens_bussiness/business-signup';
import BusinessList from './screens_bussiness/business_list';
import BusinessDetails from './screens_bussiness/businessDetails';
import BusinessTaxAssessment from './screens_bussiness/tax_assesment';
import BusinessListforTax from './screens_bussiness/business_list_for_tax';
import BusinessTaxCreate from './screens_bussiness/create_tax_assesement';
import BusinessListOfTaxAssessments from './screens_bussiness/list_of_tax_assesments';
import BusinessUpdateTaxAssessment from './screens_bussiness/update_tax_assesment';
import BusinessListForNotice from './screens_bussiness/business_list_for_notice';
import BusinessNotices from './screens_bussiness/business_notices';
import CreateBusItNotice from './screens_bussiness/create_it_notice';
import BusITNoticeList from './screens_bussiness/it_notice_lists';
import UpdateBusITNotice from './screens_bussiness/update_bus_it_notice';
import AuditHome from './users_routes/audit_users/home';

import Layout from './components/Layout';

const App = () => {
    return (
        <Router>
            <Routes>

                {/* Define Home Page or Start page */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* User authentication routes */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                {/* Dashboard layout wrapper for authenticated pages */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/logout" element={<Logout />} />

                    {/* Customer Singup routes */}
                    <Route path='/customer-signup' element={<Customersignup />} />
                    <Route path='/customers' element={<CustomerView />} />
                    <Route path="/customer/:id" element={<CustomerDetails />} />
                    
                    {/* Customers Tax Assesments routes */}
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

                    {/* Business Tax Assesments */}
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
                    
                    {/* Users Routes */}
                    <Route path='/home-audit' element={<AuditHome />} />
                </Route>

            </Routes>
        </Router>
    );
};

export default App;
