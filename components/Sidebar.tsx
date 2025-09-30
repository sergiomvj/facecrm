import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardIcon, AppsIcon, ContactsIcon, DealsIcon, TasksIcon } from './icons';
import { useAppContext } from '../context/AppContext';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, isActive }) => (
    <li>
        <Link
            to={path}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-neutral-200 hover:bg-neutral-700 dark:hover:bg-neutral-800'
            }`}
        >
            {icon}
            <span className="ml-4 font-medium">{label}</span>
        </Link>
    </li>
);

const navItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { path: '/apps', label: 'Apps', icon: <AppsIcon className="w-6 h-6" /> },
    { path: '/contacts', label: 'Contacts', icon: <ContactsIcon className="w-6 h-6" /> },
    { path: '/deals', label: 'Deals', icon: <DealsIcon className="w-6 h-6" /> },
    { path: '/tasks', label: 'Tasks', icon: <TasksIcon className="w-6 h-6" /> },
];

const DataSourceToggle: React.FC = () => {
    const { dataSource, setDataSource, loading } = useAppContext();
    const isLive = dataSource === 'live';

    const handleToggle = () => {
        if (loading) return;
        setDataSource(isLive ? 'mock' : 'live');
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
                <span className={`text-xs font-medium ${!isLive ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>Mock Data</span>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-brand-primary dark:focus:ring-offset-neutral-900 ${isLive ? 'bg-brand-primary' : 'bg-neutral-600'} ${loading ? 'cursor-wait' : ''}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isLive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-xs font-medium ${isLive ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>Live Data</span>
            </div>
            {loading && <p className="text-xs text-neutral-400 dark:text-neutral-500">Loading data...</p>}
        </div>
    );
};


const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme } = useAppContext();

  const logoUrl = theme === 'dark' 
    ? 'https://i.imgur.com/RWK8r26.png' 
    : 'https://i.imgur.com/QTntjm8.png';

  return (
    <aside className="w-64 bg-neutral-800 text-white flex flex-col h-screen p-4 dark:bg-neutral-900">
      <div className="flex items-center justify-center py-4 mb-8 border-b border-neutral-700 dark:border-neutral-800">
        <img src={logoUrl} alt="FaceCRM Logo" />
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map(item => (
            <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-neutral-700 dark:border-neutral-800">
          <DataSourceToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
