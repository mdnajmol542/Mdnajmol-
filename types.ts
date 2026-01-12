
export type Gateway = 'bKash' | 'Nagad' | 'Rocket';

export interface Transaction {
  id: string;
  gateway: Gateway;
  amount: number;
  accountNumber: string;
  status: 'Success' | 'Processing';
  timestamp: string;
  type: 'Withdraw' | 'Transfer';
}

export type AuthView = 'login' | 'signup';
export type AppView = 'dashboard' | 'transfer' | 'history';

export interface AppState {
  isLoggedIn: boolean;
  user: {
    name: string;
    balance: number;
  } | null;
  transactions: Transaction[];
}

// Support types for broader functionality if needed
export type Section = 'concept' | 'roadmap' | 'design' | 'code';
export interface AppIdea {
  title: string;
  description: string;
  targetAudience: string;
}

// Adding RoadmapItem interface which was missing and causing a compilation error in geminiService.ts
export interface RoadmapItem {
  phase: string;
  tasks: string[];
}
