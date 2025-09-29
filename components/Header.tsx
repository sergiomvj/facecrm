import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronDownIcon, SearchIcon } from './icons';
import { Contact, Deal } from '../types';

interface HeaderProps {
    title: string;
}

const AppSwitcher: React.FC = () => {
    const { apps, selectedAppId, setSelectedAppId, selectedAppName } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (appId: string) => {
        setSelectedAppId(appId);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
                <span>{selectedAppName}</span>
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleSelect('all'); }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            All Apps
                        </a>
                        {apps.map((app) => (
                            <a
                                key={app.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleSelect(app.id); }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {app.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { contacts, deals } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ contacts: Contact[], deals: Deal[] }>({ contacts: [], deals: [] });
    const [isSearchActive, setIsSearchActive] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchActive(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 1) {
            const lowerCaseQuery = query.toLowerCase();
            const filteredContacts = contacts.filter(c => 
                c.name.toLowerCase().includes(lowerCaseQuery) ||
                c.email.toLowerCase().includes(lowerCaseQuery) ||
                c.company.toLowerCase().includes(lowerCaseQuery)
            );
            const filteredDeals = deals.filter(d => 
                d.title.toLowerCase().includes(lowerCaseQuery)
            );
            setSearchResults({ contacts: filteredContacts, deals: filteredDeals });
            setIsSearchActive(true);
        } else {
            setSearchResults({ contacts: [], deals: [] });
            setIsSearchActive(false);
        }
    };
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);


    return (
        <header className="bg-neutral-50 border-b border-neutral-200 p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={searchRef}>
                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                    <input
                        type="text"
                        placeholder="Search contacts and deals..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-brand-primary focus:border-brand-primary w-64"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery.length > 1 && setIsSearchActive(true)}
                    />
                     {isSearchActive && (searchResults.contacts.length > 0 || searchResults.deals.length > 0) && (
                         <div className="absolute mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 max-h-96 overflow-y-auto">
                            <div className="py-1">
                                {searchResults.contacts.length > 0 && (
                                    <div>
                                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacts</h3>
                                        <ul>
                                            {searchResults.contacts.map(contact => (
                                                <li key={contact.id}>
                                                    <Link to={`/contacts/${contact.id}`} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                                        <p className="text-sm text-gray-500">{contact.company} &middot; {contact.email}</p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                 {searchResults.deals.length > 0 && (
                                    <div>
                                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-100">Deals</h3>
                                        <ul>
                                            {searchResults.deals.map(deal => {
                                                const contact = contacts.find(c => c.id === deal.contactId);
                                                return (
                                                    <li key={deal.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                        <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {contact?.name ? `${contact.name} · ` : ''} 
                                                            {formatCurrency(deal.amount)} - {deal.stage}
                                                        </p>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}
                </div>
                <AppSwitcher />
                <img
                    className="w-10 h-10 rounded-full"
                    src="https://picsum.photos/seed/user/100/100"
                    alt="User"
                />
            </div>
        </header>
    );
};

export default Header;