import { configureStore } from '@reduxjs/toolkit';
import classesReducer from './classesSlice';
import studentsReducer from './studentsSlice';
import assignmentsReducer from './assignmentsSlice';

export const store = configureStore({
  reducer: {
    classes: classesReducer,
    students: studentsReducer,
    assignments: assignmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;