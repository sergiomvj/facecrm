import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { useAppContext } from '../context/AppContext';
import { monthlyRevenueData } from '../data/mockData';
import { ContactsIcon, DealsIcon } from './icons';
import { DealStage } from '../types';

const Dashboard: React.FC = () => {
  const { selectedAppId, contacts, deals, theme } = useAppContext();

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

  const isDarkMode = theme === 'dark';
  const tickColor = isDarkMode ? '#A3A3A3' : '#6B7280'; // neutral-400 : gray-500
  const tooltipStyles = {
    contentStyle: {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', // neutral-800 : white
        borderColor: isDarkMode ? '#374151' : '#E5E7EB', // neutral-700 : neutral-200
        color: isDarkMode ? '#F3F4F6' : '#111827', // neutral-100 : neutral-900
    },
    itemStyle: {
        color: isDarkMode ? '#F3F4F6' : '#111827'
    }
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

      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-neutral-800">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-neutral-200">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={monthlyRevenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="name" tick={{ fill: tickColor }} />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value as number)} tick={{ fill: tickColor }} />
            <Tooltip contentStyle={tooltipStyles.contentStyle} itemStyle={tooltipStyles.itemStyle} cursor={{ fill: isDarkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(209, 213, 219, 0.3)' }} />
            <Legend wrapperStyle={{ color: tickColor }} />
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