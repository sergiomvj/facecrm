import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Deal, Task } from '../types';

const ContactDetail: React.FC = () => {
    const { contactId } = useParams<{ contactId: string }>();
    const { contacts, deals, tasks, apps } = useAppContext();

    const contact = useMemo(() => contacts.find(c => c.id === contactId), [contacts, contactId]);
    
    const associatedDeals = useMemo(() => {
        if (!contact) return [];
        return deals.filter(deal => deal.contactId === contact.id);
    }, [deals, contact]);

    const associatedTasks = useMemo(() => {
        if (!contact) return [];
        return tasks.filter(task => task.contactId === contact.id);
    }, [tasks, contact]);
    
    const associatedApps = useMemo(() => {
        if (!contact) return [];
        return apps.filter(app => contact.app_ids.includes(app.id));
    }, [apps, contact]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    if (!contact) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Contact not found</h2>
                <Link to="/contacts" className="mt-4 inline-block text-brand-primary hover:underline">
                    Return to Contacts List
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Contact Header */}
            <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
                <img className="w-24 h-24 rounded-full" src={contact.avatarUrl} alt={contact.name} />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
                    <p className="text-lg text-gray-600">{contact.company}</p>
                    <p className="text-md text-gray-500">{contact.email}</p>
                    <div className="mt-2">
                        <span className="text-sm text-gray-500">Member since: {new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                 <div className="ml-auto">
                    <h3 className="text-sm font-medium text-gray-500">Associated Apps</h3>
                    <div className="flex space-x-2 mt-1">
                        {associatedApps.map(app => (
                             <span key={app.id} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                app.plan === 'Enterprise' ? 'bg-blue-100 text-blue-800' : 
                                app.plan === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {app.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Associated Deals */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Deals ({associatedDeals.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {associatedDeals.map((deal: Deal) => (
                                <tr key={deal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deal.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(deal.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deal.stage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(deal.closeDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Associated Tasks */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks ({associatedTasks.length})</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {associatedTasks.map((task: Task) => (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        task.status === 'Done' ? 'bg-green-100 text-green-800' : 
                                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {task.status}
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;
