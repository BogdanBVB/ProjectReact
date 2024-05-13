import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CustomerForm from "./components/CustomerForm.jsx";
import HomePage from "./components/HomePage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import DashboardForm from "./components/DashboardForm.jsx";
import OpenCloseCurrentAccountsForm from "./components/OpenCloseCurrentAccountsForm.jsx";
import OpenCloseSavingsAccountsForm from "./components/OpenCloseSavingsAccountsForm.jsx";
import PaymentsAndTransfersForm from "./components/PaymentsAndTransfersForm.jsx";
import TransfersBetweenOwnAccountsForm from "./components/TransfersBetweenOwnAccountsForm.jsx";
import TransfersToOtherGBROAccountsForm from "./components/TransferToOtherGBROAccountsForm.jsx";
import TransfersToOtherBanksForm from "./components/TransfersToOtherBanksForm.jsx";
import StatementsForm from "./components/StatementsForm.jsx";
import ExchangeForm from "./components/ExchangeForm.jsx";



const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <HomePage/> },
            { path: '/new-customer', element: <CustomerForm /> },
            { path: '/log-in', element: <LoginForm /> },
            { path: '/dashboard', element: <DashboardForm /> },
            { path: '/currentAccounts', element: <OpenCloseCurrentAccountsForm /> },
            { path: '/savingsAccounts', element: <OpenCloseSavingsAccountsForm /> },
            { path: '/payments', element: <PaymentsAndTransfersForm /> },
            { path: '/ownAccounts', element: <TransfersBetweenOwnAccountsForm /> },
            { path: '/otherGBROAccounts', element: <TransfersToOtherGBROAccountsForm /> },
            { path: '/otherBanksAccounts', element: <TransfersToOtherBanksForm /> },
            { path: '/statements', element: <StatementsForm /> },
            { path: '/exchange', element: <ExchangeForm /> },
        ],
    },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
