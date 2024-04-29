import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import SampleDashboard from "./components/modules/sample-module/DashBoard";
import './lang/i18next';
import CustomerIndex from "./components/modules/core/customer/CustomerIndex";
import UserIndex from "./components/modules/core/user/UserIndex";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
import ConfigurationIndex from "./components/modules/inventory/configuraton/ConfigurationIndex";
import CategoryGroupIndex from "./components/modules/inventory/category-group/CategoryGroupIndex";
import CategoryIndex from "./components/modules/inventory/category/CategoryIndex";
import ProductIndex from "./components/modules/inventory/product/ProductIndex.jsx";
import SalesIndex from "./components/modules/inventory/sales/SalesIndex";
import SalesForm from "./components/modules/inventory/sales/SalesForm";

import SampleInvoice from "./components/modules/sample-module/sample-layout/SampleInvoice";
import SampleIndex from "./components/modules/sample-module/sample-layout/SampleIndex";
import DomainIndex from "./components/modules/domain/domain/DomainIndex";
import TransactionModeIndex from "./components/modules/accounting/transaction-mode/TransactionModeIndex.jsx";
import SalesInvoice from "./components/modules/inventory/sales/SalesInvoice";
import Sitemap from "./components/modules/dashboard/SItemap";
import PurchaseIndex from "./components/modules/inventory/purchase/PurchaseIndex";
import PurchaseInvoice from "./components/modules/inventory/purchase/PurchaseInvoice";
import VoucherIndex from "./components/modules/accounting/voucher-entry/VoucherIndex";
import HeadGroupIndex from "./components/modules/accounting/head-group/HeadGroupIndex";
function AppRoute() {

    return (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path="/" element={<Layout/>}>
                <Route path="/sample/">
                    <Route path="" element={<SampleDashboard/>}/>
                    <Route path="invoice" element={<SampleInvoice/>}/>
                    <Route path="index" element={<SampleIndex/>}/>
                </Route>
                <Route path="/core/">
                    <Route path="customer" element={<CustomerIndex/>}/>
                    <Route path="user" element={<UserIndex/>}/>
                    <Route path="vendor" element={<VendorIndex/>}/>
                </Route>
                <Route path="/inventory/">
                    <Route path="sales" element={<SalesIndex/>}/>
                    <Route path="sales-invoice" element={<SalesInvoice/>}/>
                    <Route path="purchase" element={<PurchaseIndex/>}/>
                    <Route path="purchase-invoice" element={<PurchaseInvoice/>}/>
                    <Route path="product" element={<ProductIndex/>}/>
                    <Route path="category" element={<CategoryIndex/>}/>
                    <Route path="category-group" element={<CategoryGroupIndex/>}/>
                    <Route path="config" element={<ConfigurationIndex/>}/>
                </Route>
                <Route path="/domain/">
                    <Route path="" element={<DomainIndex/>}/>
                </Route>
                <Route path="/accounting/">
                    <Route path="voucher-entry" element={<VoucherIndex/>}/>
                    <Route path="head-group" element={<HeadGroupIndex/>}/>
                    <Route path="transaction-mode" element={<TransactionModeIndex/>}/>
                </Route>
                <Route path="sitemap" element={<Sitemap/>}/>
            </Route>
        </Routes>

    )
}

export default AppRoute
