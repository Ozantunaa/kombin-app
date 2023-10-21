

import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
const store = configureStore({
  reducer: {
    user: userSlice,
    // Diğer reducer'ları buraya ekleyebilirsiniz
  },
});

export default store;
