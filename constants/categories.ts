export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export const categories: Category[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#5D5FEF',
    icon: 'briefcase',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#FF8A65',
    icon: 'user',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#4CAF50',
    icon: 'shopping-cart',
  },
  {
    id: 'health',
    name: 'Health',
    color: '#2196F3',
    icon: 'heart',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#FFC107',
    icon: 'dollar-sign',
  },
  {
    id: 'education',
    name: 'Education',
    color: '#9C27B0',
    icon: 'book-open',
  },
];

export const getCategory = (id: string): Category => {
  return categories.find(category => category.id === id) || categories[0];
};