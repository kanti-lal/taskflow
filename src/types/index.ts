export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'closed';
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}
