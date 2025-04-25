import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axioss from '../components/axios';

import { hostBack } from "../config";

interface Class {
  id: number;
  name: string;
  studentCount: number;
  teachers: { id: number; name: string }[];
}

interface ClassesState {
  classes: Class[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  status: 'idle',
  error: null,
};

export const fetchClasses = createAsyncThunk(`classes/fetchClasses`, async () => {
  const response = await axioss.get(`${hostBack}/api/classes`);
  console.log("Full response: ", response);

  return response.data;
});

export const addClass = createAsyncThunk('classes/addClass', async (newClass: Omit<Class, 'id'>) => {
  const response = await axioss.post(`${hostBack}/api/classes`, newClass);
  return response.data;
});

export const updateClass = createAsyncThunk('classes/updateClass', async (updatedClass: Class) => {
  const response = await axioss.patch(`${hostBack}/api/classes/${updatedClass.id}`, updatedClass);
  return response.data;
});

export const deleteClass = createAsyncThunk('classes/deleteClass', async (id: number) => {
  await axioss.delete(`${hostBack}/api/classes/${id}`);
  return id;
});

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.classes = action.payload;
        } else {
          state.classes = [];  // Если API вернул что-то другое
        }
     })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch classes';
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.classes.push(action.payload);
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex((cls) => cls.id === action.payload.id);
        if (index >= 0) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((cls) => cls.id !== action.payload);
      });
  },
});

export default classesSlice.reducer;
