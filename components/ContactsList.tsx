import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Contact, App } from '../types';
import { PlusIcon, XIcon } from './icons';

// --- Start of AddContactModal component ---
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose }) => {
  const { apps, addContact } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAppToggle = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const isFormValid = name && email && company && selectedApps.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    await addContact({
      name,
      email,
      company,
      app_ids: selectedApps,
    });
    
    // Reset form and close modal
    setName('');
    setEmail('');
    setCompany('');
    setSelectedApps([]);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold text-neutral-800">Add New Contact</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200" aria-label="Close modal">
            <XIcon className="w-6 h-6 text-neutral-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-neutral-700">Company</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <p className="block text-sm font-medium text-neutral-700">Associate with Apps</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {apps.map((app: App) => (
                <div key={app.id} className="flex items-center">
                  <input
                    id={`app-${app.id}`}
                    type="checkbox"
                    checked={selectedApps.includes(app.id)}
                    onChange={() => handleAppToggle(app.id)}
                    className="h-4 w-4 text-brand-primary border-neutral-300 rounded focus:ring-brand-primary"
                  />
                  <label htmlFor={`app-${app.id}`} className="ml-3 text-sm text-neutral-600">{app.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- End of AddContactModal component ---

const ContactsList: React.FC = () => {
    const { selectedAppId, contacts } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredContacts = useMemo(() => {
        if (selectedAppId === 'all') {
            return contacts;
        }
        return contacts.filter(contact => contact.app_ids.includes(selectedAppId));
    }, [selectedAppId, contacts]);

    return (
        <div className="p-8">
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Contact
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredContacts.map((contact: Contact) => (
                            <tr key={contact.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={contact.avatarUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                            <div className="text-sm text-gray-500">{contact.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{contact.company}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Fix: Corrected typo from toLocaleDateDateString to toLocaleDateString */}
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/contacts/${contact.id}`} className="text-brand-primary hover:text-blue-700">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ContactsList;