import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Deal, DealStage, Contact, App } from '../types';
import { PlusIcon, XIcon, EditIcon, TrashIcon } from './icons';

// --- Start of DealModal component ---
interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
}

const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, dealToEdit }) => {
    const { apps, contacts, addDeal, editDeal, selectedAppId } = useAppContext();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [stage, setStage] = useState<DealStage>(DealStage.LeadIn);
    const [closeDate, setCloseDate] = useState('');
    const [contactId, setContactId] = useState('');
    const [appId, setAppId] = useState('');
    const [probability, setProbability] = useState(0);
    const [nextStep, setNextStep] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!dealToEdit;

    useEffect(() => {
        if (isOpen) {
            if (isEditing && dealToEdit) {
                setTitle(dealToEdit.title);
                setAmount(String(dealToEdit.amount));
                setStage(dealToEdit.stage);
                setCloseDate(new Date(dealToEdit.closeDate).toISOString().split('T')[0]);
                setContactId(dealToEdit.contactId);
                setAppId(dealToEdit.appId);
                setProbability(dealToEdit.probability);
                setNextStep(dealToEdit.nextStep);
            } else {
                setTitle('');
                setAmount('');
                setStage(DealStage.LeadIn);
                setCloseDate('');
                setContactId('');
                setAppId(selectedAppId !== 'all' ? selectedAppId : '');
                setProbability(0);
                setNextStep('');
            }
        }
    }, [dealToEdit, isEditing, isOpen, selectedAppId]);

    const isFormValid = title && amount && closeDate && contactId && appId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        const dealData = {
            title,
            amount: Number(amount),
            stage,
            closeDate: new Date(closeDate).toISOString(),
            contactId,
            appId,
            probability,
            nextStep,
        };

        if (isEditing && dealToEdit) {
            await editDeal({ ...dealToEdit, ...dealData });
        } else {
            await addDeal(dealData);
        }
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-semibold text-neutral-800">{isEditing ? 'Edit Deal' : 'Add New Deal'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200">
                        <XIcon className="w-6 h-6 text-neutral-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Form fields */}
                    <input name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Deal Title" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" required />
                        <input name="closeDate" type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" required />
                    </div>
                    <select name="stage" value={stage} onChange={e => setStage(e.target.value as DealStage)} className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md">
                        {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select name="contactId" value={contactId} onChange={e => setContactId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md" required>
                        <option value="">Select a contact</option>
                        {contacts.map((c: Contact) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select name="appId" value={appId} onChange={e => setAppId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md" required>
                        <option value="">Select an app</option>
                        {apps.map((a: App) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Probability: {probability}%</label>
                        <input type="range" min="0" max="100" value={probability} onChange={e => setProbability(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <textarea name="nextStep" value={nextStep} onChange={e => setNextStep(e.target.value)} placeholder="Next Step" rows={2} className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" />
                    <div className="flex justify-end pt-6 border-t mt-6 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200">Cancel</button>
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300">{isSubmitting ? 'Saving...' : 'Save Deal'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// --- End of DealModal component ---


const DealCard: React.FC<{ deal: Deal; onEdit: (deal: Deal) => void; onDelete: (dealId: string) => void; onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void; }> = ({ deal, onEdit, onDelete, onDragStart }) => {
    const { contacts } = useAppContext();
    const contact = contacts.find(c => c.id === deal.contactId);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

    return (
        <div draggable onDragStart={(e) => onDragStart(e, deal.id)} className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500 cursor-grab active:cursor-grabbing relative group">
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(deal)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => onDelete(deal.id)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"><TrashIcon className="w-4 h-4" /></button>
            </div>
            <p className="font-semibold text-gray-800 pr-12">{deal.title}</p>
            <p className="text-sm text-gray-600">{formatCurrency(deal.amount)}</p>
            
            <div className="mt-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Probability</span>
                    <span>{deal.probability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${deal.probability}%` }}></div>
                </div>
            </div>
            {deal.nextStep && <p className="text-xs text-gray-600 mt-2 truncate" title={deal.nextStep}><strong>Next:</strong> {deal.nextStep}</p>}

            {contact && (
                <div className="flex items-center mt-2 pt-2 border-t">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-6 h-6 rounded-full mr-2" />
                    <span className="text-xs text-gray-500">{contact.name}</span>
                </div>
            )}
        </div>
    );
};

const PipelineColumn: React.FC<{ title: DealStage; deals: Deal[]; onEdit: (deal: Deal) => void; onDelete: (dealId: string) => void; onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void; onDrop: (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => void; }> = ({ title, deals, onEdit, onDelete, onDragStart, onDrop }) => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);

    return (
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, title)} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-gray-700">{title} <span className="text-sm font-normal text-gray-500">({deals.length})</span></h3>
                <span className="text-sm text-gray-500 font-medium">{formatCurrency(totalValue)}</span>
            </div>
            <div className="h-full">
                {deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} onDragStart={onDragStart}/>
                ))}
            </div>
        </div>
    );
};


const DealsPipeline: React.FC = () => {
    const { selectedAppId, deals, editDeal, deleteDeal } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);

    const filteredDeals = useMemo(() => {
        if (selectedAppId === 'all') {
            return deals;
        }
        return deals.filter(deal => deal.appId === selectedAppId);
    }, [selectedAppId, deals]);
    
    const stages = Object.values(DealStage);

    const dealsByStage = useMemo(() => {
        return stages.reduce((acc, stage) => {
            acc[stage] = filteredDeals.filter(deal => deal.stage === stage).sort((a,b) => b.amount - a.amount);
            return acc;
        }, {} as Record<DealStage, Deal[]>);
    }, [filteredDeals, stages]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
        e.dataTransfer.setData("dealId", dealId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: DealStage) => {
        const dealId = e.dataTransfer.getData("dealId");
        const dealToMove = deals.find(d => d.id === dealId);
        if (dealToMove && dealToMove.stage !== newStage) {
            editDeal({ ...dealToMove, stage: newStage });
        }
    };
    
    const handleOpenModalForAdd = () => { setDealToEdit(null); setIsModalOpen(true); };
    const handleOpenModalForEdit = (deal: Deal) => { setDealToEdit(deal); setIsModalOpen(true); };
    const handleCloseModal = () => { setDealToEdit(null); setIsModalOpen(false); };

    const handleDeleteDeal = async (dealId: string) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            await deleteDeal(dealId);
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-end items-center mb-6">
                <button onClick={handleOpenModalForAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                    <PlusIcon className="w-5 h-5 mr-2" /> New Deal
                </button>
            </div>
            <div className="flex-grow overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                    {stages.map(stage => (
                        <PipelineColumn 
                            key={stage} 
                            title={stage} 
                            deals={dealsByStage[stage]}
                            onEdit={handleOpenModalForEdit}
                            onDelete={handleDeleteDeal}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            </div>
            <DealModal isOpen={isModalOpen} onClose={handleCloseModal} dealToEdit={dealToEdit} />
        </div>
    );
};

export default DealsPipeline;