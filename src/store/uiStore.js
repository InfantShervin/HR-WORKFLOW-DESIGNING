import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // State
  selectedNodeId: null,
  showSandbox: false,
  showFormPanel: false,
  sidebarOpen: true,
  showImportModal: false,
  showSaveModal: false,
  notifications: [],
  theme: 'light',

  // UI Actions
  selectNode: (nodeId) => set({ selectedNodeId: nodeId, showFormPanel: !!nodeId }),
  deselectNode: () => set({ selectedNodeId: null, showFormPanel: false }),

  toggleSandbox: () => set(state => ({ showSandbox: !state.showSandbox })),
  openSandbox: () => set({ showSandbox: true }),
  closeSandbox: () => set({ showSandbox: false }),

  toggleFormPanel: () => set(state => ({ showFormPanel: !state.showFormPanel })),
  openFormPanel: () => set({ showFormPanel: true }),
  closeFormPanel: () => set({ showFormPanel: false }),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  toggleImportModal: () => set(state => ({ showImportModal: !state.showImportModal })),
  toggleSaveModal: () => set(state => ({ showSaveModal: !state.showSaveModal })),

  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // Notifications
  addNotification: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    set(state => ({
      notifications: [...state.notifications, { id, message, type }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
}));
