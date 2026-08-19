import { Category } from '@/types/category.types';

export type MockSubscription = {
  id: string;
  name: string;
  category: Category;
  categoryColor: string;
  price: string;
  cycle: string;
  date: string;
  when: string;
  isScanned?: boolean;
};

export const mockTimeline: MockSubscription[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    categoryColor: '#E44830',
    price: '379 ₴',
    cycle: 'щомісяця',
    date: '21 серп',
    when: 'через 3 дні',
    isScanned: true,
  },
  {
    id: 'gym-pass',
    name: 'Gym Pass',
    category: 'fitness',
    categoryColor: '#DCB85C',
    price: '899 ₴',
    cycle: 'щомісяця',
    date: '23 серп',
    when: 'через 5 днів',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'streaming',
    categoryColor: '#1DB954',
    price: '159 ₴',
    cycle: 'щомісяця',
    date: '25 серп',
    when: 'через 7 днів',
    isScanned: true,
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'streaming',
    categoryColor: '#FD402C',
    price: '229 ₴',
    cycle: 'щомісяця',
    date: '27 серп',
    when: 'через 9 днів',
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    category: 'games',
    categoryColor: '#9146FF',
    price: '119 ₴',
    cycle: 'щомісяця',
    date: '30 серп',
    when: 'через 12 днів',
  },
];
