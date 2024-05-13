// App.jsx
import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import './App.css'

function App() {
    return (
        <ErrorBoundary>
            <main>
                <Outlet />
            </main>
        </ErrorBoundary>
    );
}
export default App;
