import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Admin login
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/admin/signin', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch current admin (not implemented yet)
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/admin/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { admin: null, status: 'idle', error: null },
  reducers: {
    signOut(state) {
      state.admin = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signIn.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        // Extract admin data (backend returns { ok, id, username })
        const { ok, ...adminData } = action.payload;
        state.admin = adminData;
      })
      .addCase(signIn.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; })
      .addCase(fetchMe.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.status = 'succeeded'; state.admin = action.payload; })
      .addCase(fetchMe.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; });
  }
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
