import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { App, Contact, Deal, Task } from '../types';
import { mockApps, mockContacts, mockDeals, mockTasks } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

type DataSource = 'mock' | 'live';

interface AppContextType {
  apps: App[];
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  selectedAppId: string; // 'all' or an app.id
  setSelectedAppId: (id: string) => void;
  selectedAppName: string;
  addApp: (app: Omit<App, 'id' | 'createdAt'>) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'avatarUrl'>) => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id'>) => Promise<void>;
  editDeal: (deal: Deal) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataSource>(() => (localStorage.getItem('dataSource') as DataSource) || 'mock');
  
  useEffect(() => {
    localStorage.setItem('dataSource', dataSource);
    fetchData();
  }, [dataSource]);
  
  const fetchData = async () => {
    setLoading(true);
    if (dataSource === 'live' && supabase) {
      try {
        const [appsRes, contactsRes, dealsRes, tasksRes] = await Promise.all([
          supabase.from('apps').select('*').order('createdAt', { ascending: false }),
          supabase.from('contacts').select('*').order('createdAt', { ascending: false }),
          supabase.from('deals').select('*').order('closeDate', { ascending: false }),
          supabase.from('tasks').select('*').order('dueDate', { ascending: false }),
        ]);
        if (appsRes.error || contactsRes.error || dealsRes.error || tasksRes.error) {
            console.error(appsRes.error || contactsRes.error || dealsRes.error || tasksRes.error);
            throw new Error("Failed to fetch data from Supabase.");
        }
        setApps(appsRes.data || []);
        setContacts(contactsRes.data || []);
        setDeals(dealsRes.data || []);
        setTasks(tasksRes.data || []);
      } catch (error) {
        console.error("Error fetching data, falling back to mock data.", error);
        loadMockData();
        setDataSource('mock');
      }
    } else {
        loadMockData();
    }
    setLoading(false);
  };

  const loadMockData = () => {
    setApps(mockApps);
    setContacts(mockContacts);
    setDeals(mockDeals);
    setTasks(mockTasks);
  };

  const selectedAppName = selectedAppId === 'all' 
    ? 'All Apps' 
    : apps.find(app => app.id === selectedAppId)?.name || 'Unknown App';

  const addApp = async (appData: Omit<App, 'id' | 'createdAt'>) => {
    if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('apps').insert([appData]).select();
        if (error) console.error("Error adding app:", error);
        else if (data) setApps(prev => [data[0], ...prev]);
    } else {
        const newApp: App = { ...appData, id: `app_${Date.now()}`, createdAt: new Date().toISOString() };
        setApps(prev => [newApp, ...prev]);
    }
  }
    
  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'avatarUrl'>) => {
      const newContactData = {
          ...contactData,
          avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      };
      if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('contacts').insert([newContactData]).select();
        if (error) console.error("Error adding contact:", error);
        else if (data) setContacts(prev => [data[0], ...prev]);
      } else {
        const newContact: Contact = { ...newContactData, id: `contact_${Date.now()}`, createdAt: new Date().toISOString() };
        setContacts(prev => [newContact, ...prev]);
      }
  };
  
  const addDeal = async (dealData: Omit<Deal, 'id'>) => {
      if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('deals').insert([dealData]).select();
        if (error) console.error("Error adding deal:", error);
        else if (data) setDeals(prev => [data[0], ...prev]);
      } else {
        const newDeal: Deal = { ...dealData, id: `deal_${Date.now()}` };
        setDeals(prev => [newDeal, ...prev]);
      }
  };

  const editDeal = async (updatedDeal: Deal) => {
    if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('deals').update(updatedDeal).eq('id', updatedDeal.id).select();
        if (error) console.error("Error editing deal:", error);
        else if (data) setDeals(prevDeals => prevDeals.map(deal => deal.id === updatedDeal.id ? data[0] : deal));
    } else {
        setDeals(prevDeals => prevDeals.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal));
    }
  };

  const deleteDeal = async (dealId: string) => {
      if (dataSource === 'live' && supabase) {
        const { error } = await supabase.from('deals').delete().eq('id', dealId);
        if (error) console.error("Error deleting deal:", error);
        else setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
      } else {
        setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
      }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('tasks').insert([taskData]).select();
        if (error) console.error("Error adding task:", error);
        else if (data) setTasks(prev => [data[0], ...prev]);
    } else {
        const newTask: Task = { ...taskData, id: `task_${Date.now()}` };
        setTasks(prev => [newTask, ...prev]);
    }
  };

  const editTask = async (updatedTask: Task) => {
    if (dataSource === 'live' && supabase) {
        const { data, error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).select();
        if (error) console.error("Error editing task:", error);
        else if (data) setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? data[0] : task));
    } else {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    }
  };

  const deleteTask = async (taskId: string) => {
      if (dataSource === 'live' && supabase) {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (error) console.error("Error deleting task:", error);
        else setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
  };

  const value = {
    apps, contacts, deals, tasks, selectedAppId, setSelectedAppId, selectedAppName, 
    addApp, addContact, addDeal, editDeal, deleteDeal, addTask, editTask, deleteTask,
    dataSource, setDataSource, loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};