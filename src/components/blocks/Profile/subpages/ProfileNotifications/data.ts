export interface ProfileNotification {
  id: number;
  date: string;
  title: string;
  description: string;
}

export const PROFILE_NOTIFICATIONS: ProfileNotification[] = [
  {
    id: 1,
    date: "15.02.2025",
    title: "Начислены бонусы ко дню рождения",
    description: "+ 1000 бонусов до 15.02.2025 г. включительно",
  },
  {
    id: 2,
    date: "15.02.2025",
    title: "Начислен кешбэк",
    description: "+ 100 бонусов",
  },
  {
    id: 3,
    date: "15.02.2025",
    title: "Акция на новую коллекцию",
    description: "Скидка 5% при покупке от 80 000 ₽",
  },
];

