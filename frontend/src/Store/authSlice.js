import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance.js"

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || '',
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  status: 'idle',
  error: null,
};

// Add this to check values during development
console.log(initialState);



// ** User Registration Thunk **
export const createAccount = createAsyncThunk("user/signup", async (formData, { rejectWithValue }) => {
  try {
      const response = await axiosInstance.post("/auth/signup", formData);
      return response.data; // Response includes user data
  } catch (error) {
      return rejectWithValue(error.response?.data || 'Signup failed');
  }
});

export const refreshAccessToken = createAsyncThunk("refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
      const response = await axiosInstance.post("/auth/refresh-token", {}, { withCredentials: true });
      if (response.data.accessToken) {
          return { accessToken: response.data.accessToken }; // Return token for state update
      }
      throw new Error("No access token returned from refresh endpoint");
  } catch (error) {
      console.error("Refresh token error:", error);
      return rejectWithValue(error.response?.data || "Failed to refresh token");
  }
});

export const loginUser = createAsyncThunk("user/login", async (credentials, { rejectWithValue }) => {
  try {
      const response = await axiosInstance.post("/auth/login", credentials, { withCredentials: true });
      if (response && response.data) {
          return response.data; // Return user data if response is valid
      } else {
          return rejectWithValue("Login failed: No response data");
      }
  } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
      const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");  // Clear token from localStorage
      localStorage.removeItem("refreshToken");
      return response.data;
  } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
  }
});

  

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      setUser: (state, action) => {
          state.user = action.payload;
          state.status = 'succeeded';
      },
      clearUser: (state) => {
          state.user = '';
          state.status = 'idle';
      },
  },
  extraReducers: (builder) => {
      builder
          .addCase(createAccount.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(createAccount.fulfilled, (state, action) => {
              const { user, accessToken, refreshToken } = action.payload || {};
              state.status = "succeeded";
              state.user = user || null;
              state.accessToken = accessToken || null;
              state.refreshToken = refreshToken || null;
          })
          .addCase(createAccount.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload;
          })
          .addCase(loginUser.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(loginUser.fulfilled, (state, action) => {
              const { user, accessToken, refreshToken } = action.payload || {};
              state.status = 'succeeded';
              state.user = user || '';
              state.accessToken = accessToken || null;
              state.refreshToken = refreshToken || null;

              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);
          })
          .addCase(loginUser.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload || 'Login failed';
              state.accessToken = null;
          })
          .addCase(logoutUser.fulfilled, (state) => {
              state.status = 'idle';
              state.user = '';
              state.accessToken = null;
              state.refreshToken = null;

              localStorage.removeItem("user");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
          })
          .addCase(refreshAccessToken.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(refreshAccessToken.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.accessToken = action.payload.accessToken;
          })
          .addCase(refreshAccessToken.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload;
          });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAccessToken = (state) => state.auth.accessToken;




export default authSlice.reducer;

