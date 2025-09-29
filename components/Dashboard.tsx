import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { useAppContext } from '../context/AppContext';
import { monthlyRevenueData } from '../data/mockData';
import { ContactsIcon, DealsIcon } from './icons';
import { DealStage } from '../types';

const Dashboard: React.FC = () => {
  const { selectedAppId, contacts, deals } = useAppContext();

  const filteredData = useMemo(() => {
    const filteredDeals = selectedAppId === 'all'
      ? deals
      : deals.filter(deal => deal.appId === selectedAppId);

    const filteredContacts = selectedAppId === 'all'
      ? contacts
      : contacts.filter(contact => contact.app_ids.includes(selectedAppId));
      
    return { deals: filteredDeals, contacts: filteredContacts };
  }, [selectedAppId, contacts, deals]);

  const totalRevenue = filteredData.deals
    .filter(deal => deal.stage === DealStage.Won)
    .reduce((sum, deal) => sum + deal.amount, 0);

  const dealsWon = filteredData.deals.filter(d => d.stage === DealStage.Won).length;
  const newContacts = filteredData.contacts.length; // Simplified for MVP

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const appColors = {
      IGOTIT: '#3B82F6',
      LifeWayUSA: '#10B981',
      QuantumLeap: '#F97316'
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)}
          icon={<DealsIcon className="w-6 h-6" />}
        />
         <StatCard 
          title="Deals Won" 
          value={String(dealsWon)}
          icon={<DealsIcon className="w-6 h-6" />}
        />
        <StatCard 
          title="New Contacts" 
          value={String(newContacts)}
          icon={<ContactsIcon className="w-6 h-6" />}
        />
        <StatCard 
          title="Avg. Deal Value" 
          value={dealsWon > 0 ? formatCurrency(totalRevenue / dealsWon) : '$0'}
          icon={<DealsIcon className="w-6 h-6" />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={monthlyRevenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value as number)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            {(selectedAppId === 'all' || selectedAppId === 'app_1') && <Bar dataKey="IGOTIT" fill={appColors.IGOTIT} stackId="a" />}
            {(selectedAppId === 'all' || selectedAppId === 'app_2') && <Bar dataKey="LifeWayUSA" fill={appColors.LifeWayUSA} stackId="a" />}
            {(selectedAppId === 'all' || selectedAppId === 'app_3') && <Bar dataKey="QuantumLeap" fill={appColors.QuantumLeap} stackId="a" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
