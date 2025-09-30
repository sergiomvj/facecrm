import { App, Contact, Deal, DealStage, Task, TaskStatus } from '../types';

export const mockApps: App[] = [
  { id: 'app_1', name: 'IGOTIT', plan: 'Enterprise', createdAt: '2023-01-15T09:30:00Z' },
  { id: 'app_2', name: 'LifeWayUSA', plan: 'Pro', createdAt: '2023-02-20T14:00:00Z' },
  { id: 'app_3', name: 'QuantumLeap', plan: 'Pro', createdAt: '2023-03-10T18:45:00Z' },
];

export const mockContacts: Contact[] = [
  { id: 'contact_1', name: 'Alice Johnson', email: 'alice.j@example.com', avatarUrl: 'https://picsum.photos/seed/alice/100/100', company: 'Innovate Inc.', app_ids: ['app_1', 'app_2'], createdAt: '2023-05-01T10:00:00Z' },
  { id: 'contact_2', name: 'Bob Smith', email: 'bob.s@example.com', avatarUrl: 'https://picsum.photos/seed/bob/100/100', company: 'Data Systems', app_ids: ['app_2'], createdAt: '2023-05-02T11:20:00Z' },
  { id: 'contact_3', name: 'Charlie Brown', email: 'charlie.b@example.com', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', company: 'Creative Solutions', app_ids: ['app_1', 'app_3'], createdAt: '2023-05-03T14:30:00Z' },
  { id: 'contact_4', name: 'Diana Prince', email: 'diana.p@example.com', avatarUrl: 'https://picsum.photos/seed/diana/100/100', company: 'Innovate Inc.', app_ids: ['app_3'], createdAt: '2023-05-04T09:00:00Z' },
  { id: 'contact_5', name: 'Ethan Hunt', email: 'ethan.h@example.com', avatarUrl: 'https://picsum.photos/seed/ethan/100/100', company: 'Global Tech', app_ids: ['app_1'], createdAt: '2023-05-05T16:45:00Z' },
  { id: 'contact_6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', avatarUrl: 'https://picsum.photos/seed/fiona/100/100', company: 'Data Systems', app_ids: ['app_2', 'app_3'], createdAt: '2023-05-06T13:10:00Z' },
];

export const mockDeals: Deal[] = [
  { id: 'deal_1', title: 'IGOTIT Enterprise License', amount: 25000, stage: DealStage.Won, contactId: 'contact_1', appId: 'app_1', closeDate: '2023-06-15T00:00:00Z', probability: 100, nextStep: 'Finalize contract.' },
  { id: 'deal_2', title: 'LifeWayUSA Pro Plan', amount: 5000, stage: DealStage.Won, contactId: 'contact_2', appId: 'app_2', closeDate: '2023-06-20T00:00:00Z', probability: 100, nextStep: 'Onboarding complete.' },
  { id: 'deal_3', title: 'QuantumLeap Pro Upgrade', amount: 8000, stage: DealStage.ProposalSent, contactId: 'contact_3', appId: 'app_3', closeDate: '2023-07-10T00:00:00Z', probability: 75, nextStep: 'Follow up on proposal feedback.' },
  { id: 'deal_4', title: 'IGOTIT Support Package', amount: 7500, stage: DealStage.DemoScheduled, contactId: 'contact_5', appId: 'app_1', closeDate: '2023-07-25T00:00:00Z', probability: 50, nextStep: 'Prepare for product demo.' },
  { id: 'deal_5', title: 'LifeWayUSA Annual Renewal', amount: 4500, stage: DealStage.ContactMade, contactId: 'contact_6', appId: 'app_2', closeDate: '2023-08-01T00:00:00Z', probability: 25, nextStep: 'Schedule renewal call.' },
  { id: 'deal_6', title: 'New Lead from Website', amount: 12000, stage: DealStage.LeadIn, contactId: 'contact_4', appId: 'app_3', closeDate: '2023-08-15T00:00:00Z', probability: 10, nextStep: 'Initial qualification call.' },
  { id: 'deal_7', title: 'Past Customer Reactivation', amount: 18000, stage: DealStage.Lost, contactId: 'contact_1', appId: 'app_2', closeDate: '2023-06-30T00:00:00Z', probability: 0, nextStep: 'Went with competitor.' },
  { id: 'deal_8', title: 'QuantumLeap Initial Deal', amount: 10000, stage: DealStage.Won, contactId: 'contact_4', appId: 'app_3', closeDate: '2023-06-05T00:00:00Z', probability: 100, nextStep: 'Project kickoff meeting scheduled.' },
];

export const mockTasks: Task[] = [
  { id: 'task_1', title: 'Follow up with Alice', description: 'Discuss the enterprise license details.', dueDate: '2023-07-20T00:00:00Z', status: TaskStatus.InProgress, contactId: 'contact_1' },
  { id: 'task_2', title: 'Prepare demo for Charlie', description: 'Showcase the new features of QuantumLeap.', dueDate: '2023-07-22T00:00:00Z', status: TaskStatus.ToDo, contactId: 'contact_3', dependencyIds: ['task_1'] },
  { id: 'task_3', title: 'Send proposal to Diana', description: 'Proposal for the new lead from the website.', dueDate: '2023-07-18T00:00:00Z', status: TaskStatus.Done, contactId: 'contact_4' },
  { id: 'task_4', title: 'Check in with Bob Smith', description: 'See how the Pro plan is working out for Data Systems.', dueDate: '2023-07-25T00:00:00Z', status: TaskStatus.ToDo, contactId: 'contact_2' },
];

export const monthlyRevenueData = [
    { name: 'Jan', IGOTIT: 12000, LifeWayUSA: 9000, QuantumLeap: 4500 },
    { name: 'Feb', IGOTIT: 15000, LifeWayUSA: 7500, QuantumLeap: 6000 },
    { name: 'Mar', IGOTIT: 22000, LifeWayUSA: 11000, QuantumLeap: 8000 },
    { name: 'Apr', IGOTIT: 18000, LifeWayUSA: 13000, QuantumLeap: 7000 },
    { name: 'May', IGOTIT: 25000, LifeWayUSA: 15000, QuantumLeap: 10000 },
    { name: 'Jun', IGOTIT: 35000, LifeWayUSA: 19500, QuantumLeap: 18000 },
];