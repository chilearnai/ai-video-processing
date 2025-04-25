import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { hostBack } from '../config';

interface Student {
  id: number;
  name: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
}

interface StudentsState {
  students: Student[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  status: 'idle',
  error: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (teacherId?: number) => {
    const response =
      teacherId && teacherId !== null
        ? await axios.get(`${hostBack}/api/teachers/${teacherId}/students`)
        : await axios.get(`${hostBack}/api/students`);
    return response.data;
  },
);

/*export const fetchStudentsById = createAsyncThunk('students/fetchStudentsById', async (teacherId: number) => {
  const response = await axios.get(`/api/teachers/${teacherId}/students`);
  return response.data;
});*/

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch students';
      });
  },
});

export default studentsSlice.reducer;
