import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Deal, DealStage } from '../types';

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
    const { contacts } = useAppContext();
    const contact = contacts.find(c => c.id === deal.contactId);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-800">{deal.title}</p>
            <p className="text-sm text-gray-600">{formatCurrency(deal.amount)}</p>
            {contact && (
                <div className="flex items-center mt-2">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-6 h-6 rounded-full mr-2" />
                    <span className="text-xs text-gray-500">{contact.name}</span>
                </div>
            )}
        </div>
    );
};

const PipelineColumn: React.FC<{ title: DealStage; deals: Deal[] }> = ({ title, deals }) => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);

    return (
        <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <span className="text-sm text-gray-500">{formatCurrency(totalValue)}</span>
            </div>
            <div>
                {deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} />
                ))}
            </div>
        </div>
    );
};


const DealsPipeline: React.FC = () => {
    const { selectedAppId, deals } = useAppContext();

    const filteredDeals = useMemo(() => {
        if (selectedAppId === 'all') {
            return deals;
        }
        return deals.filter(deal => deal.appId === selectedAppId);
    }, [selectedAppId, deals]);
    
    const stages = Object.values(DealStage);

    const dealsByStage = useMemo(() => {
        return stages.reduce((acc, stage) => {
            acc[stage] = filteredDeals.filter(deal => deal.stage === stage);
            return acc;
        }, {} as Record<DealStage, Deal[]>);
    }, [filteredDeals, stages]);


    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex-grow overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                    {stages.map(stage => (
                        <PipelineColumn key={stage} title={stage} deals={dealsByStage[stage]} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsPipeline;
