import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  theme: 'light',
  notificationLastId: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const id = state.notificationLastId + 1;
      state.notifications.push({
        id,
        timestamp: Date.now(),
        ...action.payload,
      });
      state.notificationLastId = id;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;