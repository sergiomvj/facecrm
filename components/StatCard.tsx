import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start justify-between dark:bg-neutral-800">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1 dark:text-neutral-100">{value}</p>
        {change && (
          <p className={`text-sm mt-2 ${changeColor}`}>
            {changeType === 'increase' ? '▲' : '▼'} {change}
          </p>
        )}
      </div>
      <div className="bg-brand-secondary text-brand-primary p-3 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;