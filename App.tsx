import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppsRegistry from './components/AppsRegistry';
import ContactsList from './components/ContactsList';
import ContactDetail from './components/ContactDetail';
import DealsPipeline from './components/DealsPipeline';
import Tasks from './components/Tasks';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {

  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/apps') return 'Apps Registry';
    if (path === '/contacts') return 'Contacts';
    if (path.startsWith('/contacts/')) return 'Contact Details';
    if (path === '/deals') return 'Deals Pipeline';
    if (path === '/tasks') return 'Task Management';
    return 'Dashboard';
  }

  return (
    <AppProvider>
      <div className="flex h-screen bg-neutral-100">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header title={getTitle()} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/apps" element={<AppsRegistry />} />
              <Route path="/contacts" element={<ContactsList />} />
              <Route path="/contacts/:contactId" element={<ContactDetail />} />
              <Route path="/deals" element={<DealsPipeline />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default App;