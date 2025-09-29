import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task, TaskStatus, Contact } from '../types';
import { PlusIcon, XIcon, EditIcon, TrashIcon, TableIcon, BoardIcon, LinkIcon } from './icons';

// --- Start of TaskModal component ---
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id'> | Task) => Promise<void>;
  taskToEdit?: Task | null;
  allTasks: Task[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit, allTasks }) => {
  const { contacts } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo);
  const [contactId, setContactId] = useState<string>('');
  const [dependencyIds, setDependencyIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditing && taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setDueDate(new Date(taskToEdit.dueDate).toISOString().split('T')[0]);
            setStatus(taskToEdit.status);
            setContactId(taskToEdit.contactId);
            setDependencyIds(taskToEdit.dependencyIds || []);
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
            setStatus(TaskStatus.ToDo);
            setContactId('');
            setDependencyIds([]);
        }
    }
  }, [taskToEdit, isEditing, isOpen]);

  const isFormValid = title && dueDate && contactId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const taskData = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        status,
        contactId,
        dependencyIds,
    };

    if (isEditing && taskToEdit) {
        await onSubmit({ ...taskToEdit, ...taskData });
    } else {
        await onSubmit(taskData);
    }
    setIsSubmitting(false);
  };

  const handleDepsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setDependencyIds(selectedIds);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold text-neutral-800">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200" aria-label="Close modal">
            <XIcon className="w-6 h-6 text-neutral-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              >
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="contactId" className="block text-sm font-medium text-neutral-700">Assign to Contact</label>
            <select
              id="contactId"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              required
            >
              <option value="">Select a contact</option>
              {contacts.map((contact: Contact) => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
          </div>
           <div>
            <label htmlFor="dependencies" className="block text-sm font-medium text-neutral-700">Dependencies (must be completed first)</label>
            <select
              id="dependencies"
              multiple
              value={dependencyIds}
              onChange={handleDepsChange}
              className="mt-1 block w-full h-32 px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            >
              {allTasks
                .filter(task => (!taskToEdit || task.id !== taskToEdit.id) && task.status !== TaskStatus.Done) // Exclude self and completed tasks
                .map(task => (
                    <option key={task.id} value={task.id}>
                        {task.title}
                    </option>
                ))
            }
            </select>
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
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- End of TaskModal component ---


// --- Start of DependencyWarningModal component ---
interface DependencyWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    incompleteDeps: Task[];
}
const DependencyWarningModal: React.FC<DependencyWarningModalProps> = ({ isOpen, onClose, onConfirm, incompleteDeps }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-semibold text-yellow-600">Incomplete Dependencies</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200" aria-label="Close modal">
                        <XIcon className="w-6 h-6 text-neutral-600" />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-neutral-700">This task cannot be marked as 'Done' because the following prerequisite tasks are not complete:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
                        {incompleteDeps.map(task => (
                            <li key={task.id}><strong>{task.title}</strong> (Status: {task.status})</li>
                        ))}
                    </ul>
                    <p className="text-sm text-neutral-700 mt-4">Are you sure you want to proceed?</p>
                </div>
                <div className="flex justify-end pt-6 border-t mt-6 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                        Mark as Done Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- End of DependencyWarningModal component ---

const getDueDateStatus = (dueDate: string): { status: 'overdue' | 'due-soon' | 'on-time', label: string } => {
    const now = new Date();
    const due = new Date(dueDate);
    now.setHours(0, 0, 0, 0); // Compare dates only
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { status: 'overdue', label: 'Overdue' };
    }
    if (diffDays <= 3) {
        return { status: 'due-soon', label: `Due in ${diffDays} day(s)` };
    }
    return { status: 'on-time', label: '' };
};

// --- Start of Board View components ---
const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; onDelete: (taskId: string) => void; taskMap: Record<string, Task> }> = ({ task, onEdit, onDelete, taskMap }) => {
    const { contacts } = useAppContext();
    const contact = contacts.find(c => c.id === task.contactId);
    
    const statusColors = {
        [TaskStatus.ToDo]: 'border-yellow-500',
        [TaskStatus.InProgress]: 'border-blue-500',
        [TaskStatus.Done]: 'border-green-500',
    };
    
    const dueDateInfo = getDueDateStatus(task.dueDate);
    const dueDateColors = {
        'overdue': 'text-red-600',
        'due-soon': 'text-yellow-600',
        'on-time': 'text-gray-500',
    };
    
    const dependencyNames = task.dependencyIds?.map(id => taskMap[id]?.title).filter(Boolean).join(', ');

    return (
        <div className={`bg-white p-4 rounded-lg shadow mb-4 border-l-4 ${statusColors[task.status]}`}>
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800 pr-2">{task.title}</p>
              <div className="flex-shrink-0 flex items-center space-x-2">
                {dependencyNames && (
                    <div className="relative group">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center pointer-events-none">
                            Depends on: {dependencyNames}
                        </div>
                    </div>
                )}
                <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-brand-primary"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
            {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
            <div className="flex justify-between items-end mt-4">
                {contact && (
                    <div className="flex items-center">
                        <img src={contact.avatarUrl} alt={contact.name} className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-xs text-gray-500">{contact.name}</span>
                    </div>
                )}
                <div className="text-right">
                    <span className={`text-xs font-medium ${dueDateColors[dueDateInfo.status]}`}>{dueDateInfo.label}</span>
                    <span className="block text-xs font-medium text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

const TaskColumn: React.FC<{ title: TaskStatus; tasks: Task[]; onEdit: (task: Task) => void; onDelete: (taskId: string) => void; taskMap: Record<string, Task> }> = ({ title, tasks, onEdit, onDelete, taskMap }) => {
    return (
        <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">{title} ({tasks.length})</h3>
            </div>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} taskMap={taskMap} />
                ))}
            </div>
        </div>
    );
};
// --- End of Board View components ---

const defaultFilters = { status: '', contactId: '', startDate: '', endDate: '' };

const Tasks: React.FC = () => {
    const { tasks, contacts, selectedAppId, addTask, editTask, deleteTask } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
    const [depWarning, setDepWarning] = useState<{ isOpen: boolean; task?: Omit<Task, 'id'> | Task; incompleteDeps?: Task[] }>({ isOpen: false });

    const [filters, setFilters] = useState(() => {
        try {
            const savedFilters = localStorage.getItem('taskFilters');
            return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
        } catch (error) {
            return defaultFilters;
        }
    });

    useEffect(() => {
        localStorage.setItem('taskFilters', JSON.stringify(filters));
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => setFilters(defaultFilters);

    const getContactById = (id: string) => contacts.find(c => c.id === id);
    
    const taskMap = useMemo(() => {
        return tasks.reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
        }, {} as Record<string, Task>);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let appFilteredTasks;
        if (selectedAppId === 'all') {
            appFilteredTasks = tasks;
        } else {
            const appContacts = contacts.filter(c => c.app_ids.includes(selectedAppId)).map(c => c.id);
            appFilteredTasks = tasks.filter(task => appContacts.includes(task.contactId));
        }
        
        return appFilteredTasks.filter(task => {
            const statusMatch = !filters.status || task.status === filters.status;
            const contactMatch = !filters.contactId || task.contactId === filters.contactId;
            const startDateMatch = !filters.startDate || new Date(task.dueDate) >= new Date(filters.startDate);
            const endDateMatch = !filters.endDate || new Date(task.dueDate) <= new Date(filters.endDate);
            return statusMatch && contactMatch && startDateMatch && endDateMatch;
        });

    }, [selectedAppId, tasks, contacts, filters]);

    const tasksByStatus = useMemo(() => {
        const statuses = Object.values(TaskStatus);
        return statuses.reduce((acc, status) => {
            acc[status] = filteredTasks.filter(task => task.status === status);
            return acc;
        }, {} as Record<TaskStatus, Task[]>);
    }, [filteredTasks]);

    const handleSaveTask = async (taskData: Omit<Task, 'id'> | Task) => {
        const isEditing = 'id' in taskData;
        const originalStatus = isEditing ? taskMap[taskData.id]?.status : undefined;
    
        if (taskData.status === TaskStatus.Done && originalStatus !== TaskStatus.Done && taskData.dependencyIds?.length) {
            const incompleteDependencies = taskData.dependencyIds
                .map(depId => taskMap[depId])
                .filter(depTask => depTask && depTask.status !== TaskStatus.Done);
    
            if (incompleteDependencies.length > 0) {
                setDepWarning({ isOpen: true, task: taskData, incompleteDeps: incompleteDependencies });
                handleCloseModal();
                return;
            }
        }
    
        if (isEditing) {
            await editTask(taskData as Task);
        } else {
            await addTask(taskData as Omit<Task, 'id'>);
        }
        handleCloseModal();
    };

    const handleConfirmDependencyOverride = async () => {
        if (depWarning.task) {
            if ('id' in depWarning.task) {
                await editTask(depWarning.task as Task);
            } else {
                await addTask(depWarning.task as Omit<Task, 'id'>);
            }
        }
        setDepWarning({ isOpen: false, task: undefined, incompleteDeps: [] });
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(taskId);
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.ToDo: return 'bg-yellow-100 text-yellow-800';
            case TaskStatus.InProgress: return 'bg-blue-100 text-blue-800';
            case TaskStatus.Done: return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const handleOpenModalForAdd = () => { setTaskToEdit(null); setIsModalOpen(true); };
    const handleOpenModalForEdit = (task: Task) => { setTaskToEdit(task); setIsModalOpen(true); };
    const handleCloseModal = () => { setTaskToEdit(null); setIsModalOpen(false); };
    
    const ViewSwitcher: React.FC = () => (
      <div className="flex items-center p-1 bg-gray-200 rounded-lg">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${viewMode === 'table' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>
              <TableIcon className="w-4 h-4 mr-2" /> Table
          </button>
          <button onClick={() => setViewMode('board')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${viewMode === 'board' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>
              <BoardIcon className="w-4 h-4 mr-2" /> Board
          </button>
      </div>
    );

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <ViewSwitcher />
                <button onClick={handleOpenModalForAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                    <PlusIcon className="w-5 h-5 mr-2" /> New Task
                </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">All Statuses</option>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select name="contactId" value={filters.contactId} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">All Contacts</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Start Date" />
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md shadow-sm" placeholder="End Date" />
                    <button onClick={clearFilters} className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300">Clear Filters</button>
                </div>
            </div>

            {viewMode === 'table' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTasks.map((task: Task) => {
                              const contact = getContactById(task.contactId);
                              const dueDateInfo = getDueDateStatus(task.dueDate);
                              const rowColor = dueDateInfo.status === 'overdue' ? 'bg-red-50' : dueDateInfo.status === 'due-soon' ? 'bg-yellow-50' : '';
                              const dependencyNames = task.dependencyIds?.map(id => taskMap[id]?.title).filter(Boolean).join(', ');
                              return (
                                  <tr key={task.id} className={rowColor}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">{task.title}</span>
                                            {dependencyNames && (
                                                <div className="ml-2 relative group">
                                                    <LinkIcon className="w-4 h-4 text-gray-400" />
                                                    <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center pointer-events-none">
                                                        Depends on: {dependencyNames}
                                                    </div>
                                                </div>
                                            )}
                                          </div>
                                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          {contact ? (
                                              <div className="flex items-center">
                                                  <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full" src={contact.avatarUrl} alt={contact.name} /></div>
                                                  <div className="ml-4">
                                                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                      <div className="text-sm text-gray-500">{contact.company}</div>
                                                  </div>
                                              </div>
                                          ) : <span className="text-sm text-gray-500">Unassigned</span>}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                          <button onClick={() => handleOpenModalForEdit(task)} className="text-brand-primary hover:text-blue-700">Edit</button>
                                          <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
            ) : (
              <div className="flex-grow overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                      {Object.values(TaskStatus).map(status => (
                          <TaskColumn 
                              key={status} 
                              title={status} 
                              tasks={tasksByStatus[status]}
                              onEdit={handleOpenModalForEdit}
                              onDelete={handleDeleteTask}
                              taskMap={taskMap}
                          />
                      ))}
                  </div>
              </div>
            )}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveTask}
                taskToEdit={taskToEdit}
                allTasks={tasks}
            />
            <DependencyWarningModal
                isOpen={depWarning.isOpen}
                onClose={() => setDepWarning({ isOpen: false })}
                onConfirm={handleConfirmDependencyOverride}
                incompleteDeps={depWarning.incompleteDeps || []}
            />
        </div>
    );
};

export default Tasks;