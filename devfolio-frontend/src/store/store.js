import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import mediaReducer from "./slices/mediaSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    media: mediaReducer,
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
