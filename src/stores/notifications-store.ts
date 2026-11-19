import { create } from 'zustand'
import { initialNotifications, type AppNotification } from '@/data/notifications'

interface NotificationsState {
  items: AppNotification[]
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  items: initialNotifications,
  markRead: (id) =>
    set((state) => ({ items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((state) => ({ items: state.items.map((n) => ({ ...n, read: true })) })),
}))

export const selectUnreadCount = (state: NotificationsState): number =>
  state.items.reduce((count, n) => count + (n.read ? 0 : 1), 0)
