import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { hostBack } from '../config';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'не выполнено' | 'в процессе' | 'выполнено';
}

interface AssignmentsState {
  assignments: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  status: 'idle',
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (studentId: number) => {
    const response = await axios.get(
      `${hostBack}/api/students/${studentId}/assignments`,
    );
    return response.data;
  },
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch assignments';
      });
  },
});

export default assignmentsSlice.reducer;
