export interface App {
  id: string;
  name: string;
  plan: 'Enterprise' | 'Pro' | 'Free';
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  company: string;
  app_ids: string[];
  createdAt: string;
}

export enum DealStage {
  LeadIn = 'Lead In',
  ContactMade = 'Contact Made',
  DemoScheduled = 'Demo Scheduled',
  ProposalSent = 'Proposal Sent',
  Won = 'Won',
  Lost = 'Lost',
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  contactId: string;
  appId: string;
  closeDate: string;
  probability: number; // 0-100
  nextStep: string;
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  contactId: string; // Link to a contact
  dependencyIds?: string[]; // IDs of tasks that must be completed first
}