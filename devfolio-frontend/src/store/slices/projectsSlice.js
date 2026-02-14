import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/projects", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/projects/${projectId}`, payload);
      return { projectId, ...payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
      return projectId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const togglePublishProject = createAsyncThunk(
  "projects/togglePublishProject",
  async ({ projectId, is_published }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/projects/${projectId}/publish`, { is_published });
      return { projectId, is_published };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
    builder.addCase(createProject.fulfilled, (state, action) => {
      // backend returns { ok: true, id }
      if (action.payload && action.payload.id) {
        // minimal local representation; client will typically re-fetch
        state.items.unshift({ id: action.payload.id, ...action.meta.arg });
      }
    });
    builder.addCase(updateProject.fulfilled, (state, action) => {
      const { projectId } = action.payload;
      const index = state.items.findIndex((p) => p.id === projectId);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    });
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    });
    builder.addCase(togglePublishProject.fulfilled, (state, action) => {
      const { projectId, is_published } = action.payload;
      const project = state.items.find((p) => p.id === projectId);
      if (project) {
        project.is_published = is_published;
      }
    });
  },
});

export default projectsSlice.reducer;
