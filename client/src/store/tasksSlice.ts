import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { hostBack } from '../config';
import { Certificate } from 'crypto';
import { EnumType } from 'typescript';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Speaks {
  difficulty: EnumType;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(`${hostBack}/tasks`);
  return response.data;
});

export const getTask = createAsyncThunk('tasks/getTask', async () => {
  const response = await axios.get(`${hostBack}/task/:id`);
  return response.data;
});

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (newTask: Omit<Task, 'id'>) => {
    const response = await axios.post(`${hostBack}/tasks`, newTask);
    return response.data;
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (updatedTask: Task) => {
    const response = await axios.put(
      `${hostBack}/tasks/${updatedTask.id}`,
      updatedTask,
    );
    return response.data;
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number) => {
    await axios.delete(`${hostBack}/tasks/${taskId}`);
    return taskId;
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })

      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
