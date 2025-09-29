import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { App } from '../types';
import { PlusIcon, XIcon } from './icons';

// --- AddAppModal Component ---
interface AddAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose }) => {
    const { addApp } = useAppContext();
    const [name, setName] = useState('');
    const [plan, setPlan] = useState<'Enterprise' | 'Pro' | 'Free'>('Pro');

    const isFormValid = name.trim() !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        await addApp({ name, plan });

        setName('');
        setPlan('Pro');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-semibold text-neutral-800">Register New App</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200">
                        <XIcon className="w-6 h-6 text-neutral-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="appName" className="block text-sm font-medium text-neutral-700">App Name</label>
                        <input
                            type="text"
                            id="appName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="plan" className="block text-sm font-medium text-neutral-700">Plan</label>
                        <select
                            id="plan"
                            value={plan}
                            onChange={(e) => setPlan(e.target.value as 'Enterprise' | 'Pro' | 'Free')}
                            className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        >
                            <option value="Pro">Pro</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Free">Free</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-6 border-t mt-6 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300">
                            Register App
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AppsRegistry: React.FC = () => {
    const { apps } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-8">
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Register New App
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                App Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {apps.map((app: App) => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.name}</div>
                                    <div className="text-sm text-gray-500">{app.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        app.plan === 'Enterprise' ? 'bg-blue-100 text-blue-800' : 
                                        app.plan === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {app.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-brand-primary hover:text-blue-700">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default AppsRegistry;