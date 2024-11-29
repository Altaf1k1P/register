import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../helper/axiosInstance";

// Async Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
     // console.log("API response:", response);
      return response.data; // Ensure response.data has the accessToken
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const createAccount = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  const response = await axiosInstance.get("/auth/current-user");
  //console.log("API Response:", response.data);
  return response.data;
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.error = null; // Reset error on successful signup
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.user =payload;
        console.log("Fetched user:", payload); 
    })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      );
  },
});

export default authSlice.reducer;
