export type Priority = {
  id: string;
  name: string;
  color: string;
  value: number;
};

export const priorities: Priority[] = [
  {
    id: 'high',
    name: 'High',
    color: '#F44336',
    value: 3,
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#FFC107',
    value: 2,
  },
  {
    id: 'low',
    name: 'Low',
    color: '#4CAF50',
    value: 1,
  },
];

export const getPriority = (id: string): Priority => {
  return priorities.find(priority => priority.id === id) || priorities[1];
};