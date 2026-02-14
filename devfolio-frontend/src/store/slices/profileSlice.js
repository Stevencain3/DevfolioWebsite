import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/profile');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const res = await apiClient.put('/profile', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { 
    profile: null, 
    skills: { programming: [], tools: [], professional: [] },
    experience: [],
    education: [],
    interests: '',
    status: 'idle', 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        state.profile = action.payload.profile;
        state.skills = action.payload.skills;
        state.experience = action.payload.experience;
        state.education = action.payload.education;
        state.interests = action.payload.interests;
      })
      .addCase(fetchProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; })
      .addCase(updateProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.status = 'succeeded'; state.profile = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; });
  }
});

export default profileSlice.reducer;
