import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

// fetch images for a project
export const fetchImages = createAsyncThunk(
  "media/fetchImages",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/projects/${projectId}/images`);
      return { projectId, images: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// uploadImage now accepts either:
// - { projectId, file: File, caption, sortOrder } -> multipart POST to /projects/:id/images/upload
// - { projectId, url: string, caption, sortOrder } -> JSON POST to /projects/:id/images
export const uploadImage = createAsyncThunk(
  "media/uploadImage",
  async (payload, { rejectWithValue }) => {
    const { projectId, file, url, caption, sortOrder } = payload;
    try {
      if (url) {
        // treat url as an already-hosted image -> post JSON record
        const res = await apiClient.post(`/projects/${projectId}/images`, {
          image_path: url,
          caption: caption || null,
          sort_order: sortOrder ?? 0,
        });
        return { projectId, image: res.data };
      }

      if (file) {
        // multipart upload (server must support this route)
        const form = new FormData();
        form.append("image", file);
        if (caption) form.append("caption", caption);
        if (typeof sortOrder !== "undefined") form.append("sortOrder", String(sortOrder));

        const res = await apiClient.post(
          `/projects/${projectId}/images/upload`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return { projectId, image: res.data };
      }

      return rejectWithValue("No file or url provided for upload");
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "media/deleteImage",
  async (imageId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/project-images/${imageId}`);
      return imageId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState: { byProject: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        const { projectId, images } = action.payload;
        state.byProject[projectId] = images || [];
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        const { projectId, image } = action.payload;
        if (!state.byProject[projectId]) state.byProject[projectId] = [];
        state.byProject[projectId].push(image);
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        const imageId = action.payload;
        for (const pid of Object.keys(state.byProject)) {
          state.byProject[pid] = state.byProject[pid].filter((i) => i.id !== imageId);
        }
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.status = 'loading'; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.status = 'succeeded'; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.status = 'failed'; state.error = action.payload || action.error?.message; });
  },
});

export default mediaSlice.reducer;
